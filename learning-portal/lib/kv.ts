import fs from "fs"
import path from "path"
import { serviceClient, serviceConfigured } from "@/lib/blocks-service"

// Key-value persistence for the portal's server-side state (progress, notes, feed, plans, curriculum).
//
//  - Blocks Data Gateway (schema "PortalState") when BLOCKS_SERVICE_EMAIL / BLOCKS_SERVICE_PASSWORD are set.
//    The server signs in once as that service user and reads/writes on behalf of every request;
//    who may see what is enforced by the portal's own session checks.
//  - A local JSON file otherwise, so development works with no setup.

const SCHEMA = "PortalState"

export interface KvEntry {
  key: string
  value: string
}

interface KvBackend {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  list(prefix: string): Promise<KvEntry[]>
}

// ---------- local file backend ----------

const FILE = path.join(process.cwd(), ".data", "kv.json")

function createFileBackend(): KvBackend {
  let cache: Record<string, string> | null = null

  const load = () => {
    if (cache) return cache
    try {
      cache = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf-8")) : {}
    } catch (err) {
      console.warn("Failed to read kv file:", err)
      cache = {}
    }
    return cache!
  }
  const save = () => {
    try {
      fs.mkdirSync(path.dirname(FILE), { recursive: true })
      fs.writeFileSync(FILE, JSON.stringify(cache, null, 2), "utf-8")
    } catch (err) {
      console.warn("Failed to write kv file:", err)
    }
  }

  return {
    async get(key) {
      return load()[key] ?? null
    },
    async set(key, value) {
      load()[key] = value
      save()
    },
    async delete(key) {
      delete load()[key]
      save()
    },
    async list(prefix) {
      return Object.entries(load())
        .filter(([k]) => k.startsWith(prefix))
        .map(([key, value]) => ({ key, value }))
    },
  }
}

// ---------- Blocks Data Gateway backend ----------

type Row = { ItemId?: string; itemId?: string; id?: string; key?: string; value?: string }

function rowId(row: Row): string | undefined {
  return row.ItemId || row.itemId || row.id
}

function extractRows(response: unknown): Row[] {
  const r = response as {
    data?: Record<string, unknown> & { items?: Row[] }
    items?: Row[]
  }
  const gateway = r?.data && (r.data[`get${SCHEMA}s`] as { items?: Row[] } | undefined)
  return gateway?.items ?? r?.data?.items ?? r?.items ?? []
}

function createBlocksBackend(): KvBackend {
  const collection = serviceClient.data.collection<Row>(SCHEMA, { fields: ["key", "value"] })

  // key -> ItemId, so repeat writes skip a lookup
  const ids = new Map<string, string>()

  const listPage = async (pageNo: number, filter?: Record<string, unknown>) =>
    extractRows(await collection.list({ pageNo, pageSize: 200, ...(filter ? { filter } : {}) }))

  const find = async (key: string): Promise<Row | null> => {
    const filtered = (await listPage(1, { key })).find((r) => r.key === key)
    if (filtered) return filtered
    // Filter unsupported or no match: scan the collection
    for (let page = 1; page <= 25; page++) {
      const rows = await listPage(page)
      const hit = rows.find((r) => r.key === key)
      if (hit) return hit
      if (rows.length < 200) break
    }
    return null
  }

  const all = async (): Promise<Row[]> => {
    const out: Row[] = []
    for (let page = 1; page <= 25; page++) {
      const rows = await listPage(page)
      out.push(...rows)
      if (rows.length < 200) break
    }
    return out
  }

  return {
    async get(key) {
      const row = await find(key)
      if (row) {
        const id = rowId(row)
        if (id) ids.set(key, id)
      }
      return row?.value ?? null
    },
    async set(key, value) {
      let id = ids.get(key)
      if (!id) {
        const row = await find(key)
        id = row ? rowId(row) : undefined
      }
      if (id) {
        await collection.update(id, { key, value })
        ids.set(key, id)
      } else {
        await collection.create({ key, value })
        ids.delete(key)
      }
    },
    async delete(key) {
      const id = ids.get(key) || rowId((await find(key)) || {})
      if (id) await collection.delete(id)
      ids.delete(key)
    },
    async list(prefix) {
      return (await all())
        .filter((r) => typeof r.key === "string" && r.key.startsWith(prefix))
        .map((r) => {
          const id = rowId(r)
          if (id) ids.set(r.key!, id)
          return { key: r.key!, value: r.value ?? "" }
        })
    },
  }
}

// ---------- selection ----------

const globalState = globalThis as typeof globalThis & { __txlKv?: KvBackend }

export function kvMode(): "blocks" | "file" {
  return serviceConfigured() ? "blocks" : "file"
}

function backend(): KvBackend {
  if (!globalState.__txlKv) {
    globalState.__txlKv =
      kvMode() === "blocks"
        ? createBlocksBackend()
        : createFileBackend()
  }
  return globalState.__txlKv
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  const raw = await backend().get(key)
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function kvSetJson(key: string, value: unknown): Promise<void> {
  await backend().set(key, JSON.stringify(value))
}

export async function kvDelete(key: string): Promise<void> {
  await backend().delete(key)
}

export async function kvListJson<T>(prefix: string): Promise<T[]> {
  const out: T[] = []
  for (const entry of await backend().list(prefix)) {
    try {
      out.push(JSON.parse(entry.value) as T)
    } catch {}
  }
  return out
}
