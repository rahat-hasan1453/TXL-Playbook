// Resilient Prisma client helper that works in dev mode with or without Prisma installed
import fs from "fs"
import path from "path"
import crypto from "crypto"

export interface StoredUser {
  id: string
  email: string
  passwordHash: string
  name: string
  role: "LEARNER" | "UNIT_HEAD"
  discipline: string
  avatar: string
}

const DATA_DIR = path.join(process.cwd(), ".data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

function computeHash(password: string): string {
  const salt = "txl-playbook-2026-auth"
  return crypto.createHmac("sha256", salt).update(password).digest("hex")
}

function loadUsersFromDisk(): Map<string, StoredUser> {
  const map = new Map<string, StoredUser>()
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8")
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) {
        for (const u of arr) {
          if (u.email) map.set(u.email.toLowerCase(), u)
        }
      }
    }
  } catch (err) {
    console.warn("Failed to load users from disk:", err)
  }

  // Pre-seed known active platform team members with default password123
  const defaultHash = computeHash("password123")
  const defaultUsers: StoredUser[] = [
    {
      id: "user-nico-akash",
      email: "rahat.akash1453@gmail.com",
      passwordHash: defaultHash,
      name: "Nico Paz",
      role: "LEARNER",
      discipline: "Cloud Systems Engineer",
      avatar: "NP",
    },
    {
      id: "user-enzo-hasan",
      email: "rahat.hasan1453@gmail.com",
      passwordHash: defaultHash,
      name: "Enzo Farnendes",
      role: "LEARNER",
      discipline: "Product Engineer",
      avatar: "EF",
    },
    {
      id: "user-rahat-head",
      email: "rahat.hasan@selisegroup.com",
      passwordHash: defaultHash,
      name: "Rahat Hasan",
      role: "UNIT_HEAD",
      discipline: "Leadership & Strategy",
      avatar: "RH",
    },
  ]

  let hasNew = false
  for (const du of defaultUsers) {
    if (!map.has(du.email.toLowerCase())) {
      map.set(du.email.toLowerCase(), du)
      hasNew = true
    }
  }

  if (hasNew) {
    saveUsersToDisk(map)
  }

  return map
}

function saveUsersToDisk(map: Map<string, StoredUser>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    const arr = Array.from(map.values())
    fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to save users to disk:", err)
  }
}

class PersistentUsersMap extends Map<string, StoredUser> {
  constructor() {
    super()
    const loaded = loadUsersFromDisk()
    for (const [k, v] of loaded.entries()) {
      super.set(k.toLowerCase(), v)
    }
  }

  set(key: string, value: StoredUser): this {
    super.set(key.toLowerCase(), value)
    saveUsersToDisk(this)
    return this
  }

  get(key: string): StoredUser | undefined {
    return super.get(key.toLowerCase())
  }

  has(key: string): boolean {
    return super.has(key.toLowerCase())
  }
}

// In-memory fallback store for development
const memoryStore = {
  progress: new Map<string, { userId: string; topicId: string; status: string; completedAt?: Date | null }>(),
  notes: new Map<string, { userId: string; topicId: string; content: string; updatedAt: Date }>(),
  shared: new Array<{ id: string; userId: string; userName: string; topicId: string; topicTitle: string; content: string; likes: number; createdAt: Date }>(),
  userRoles: new Map<string, "LEARNER" | "UNIT_HEAD">(),
  users: new PersistentUsersMap(),
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let client: any = null

declare const __non_webpack_require__: any

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeRequire = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : eval("require")
  const { PrismaClient } = nodeRequire("@prisma/client")
  const globalForPrisma = global as unknown as { prisma: any }
  client = globalForPrisma.prisma || new PrismaClient({ log: ["error"] })
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client
} catch {
  // Provide safe in-memory fallback for development
  client = {
    userProgress: {
      upsert: async ({ where, update, create }: any) => {
        const key = `${where.userId_topicId.userId}_${where.userId_topicId.topicId}`
        const record = { ...create, ...update }
        memoryStore.progress.set(key, record)
        return record
      },
      findMany: async () => Array.from(memoryStore.progress.values()),
    },
    userNote: {
      upsert: async ({ where, update, create }: any) => {
        const key = `${where.userId_topicId.userId}_${where.userId_topicId.topicId}`
        const record = { ...create, ...update, updatedAt: new Date() }
        memoryStore.notes.set(key, record)
        return record
      },
      findMany: async () => Array.from(memoryStore.notes.values()),
    },
    topic: {
      findUnique: async ({ where }: any) => ({ id: where.id }),
    },
  }
}

export const prisma = client
export { memoryStore }
