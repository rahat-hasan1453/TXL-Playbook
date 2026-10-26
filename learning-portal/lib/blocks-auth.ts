import { exec } from "child_process"
import { promisify } from "util"
import { UserRole } from "@/lib/auth"
import { memoryStore } from "@/lib/prisma"

const execAsync = promisify(exec)

// Dynamic cache of Blocks IAM roles with active project role assignments
const blocksRoleCache = new Map<string, UserRole>([
  ["rahat.hasan@selisegroup.com", "UNIT_HEAD"],
  ["rahat.akash1453@gmail.com", "LEARNER"],
  ["rahat.hasan1453@gmail.com", "LEARNER"],
])

let lastSyncTime = 0
const SYNC_INTERVAL_MS = 10_000 // Throttle live Blocks CLI queries to 10s

/**
 * Robustly extracts roles from any Blocks IAM data format:
 * - { default: ["boss"] }
 * - ["aam_public"]
 * - [{ name: "boss" }, { role: "boss" }]
 * - "boss"
 */
export function extractRoles(source: unknown): string[] {
  if (!source) return []
  const roles: string[] = []

  const addRole = (r: unknown) => {
    if (typeof r === "string" && r.trim()) {
      roles.push(r.trim().toLowerCase())
    } else if (r && typeof r === "object") {
      const obj = r as Record<string, unknown>
      const name = obj.slug || obj.name || obj.role || obj.key || obj.id
      if (typeof name === "string" && name.trim()) {
        roles.push(name.trim().toLowerCase())
      }
    }
  }

  if (Array.isArray(source)) {
    source.forEach(addRole)
  } else if (typeof source === "object") {
    const obj = source as Record<string, unknown>
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (Array.isArray(val)) {
        val.forEach(addRole)
      } else if (typeof val === "string") {
        addRole(val)
      }
    }
    if (obj.roles && obj.roles !== source) {
      extractRoles(obj.roles).forEach(addRole)
    }
  } else if (typeof source === "string") {
    addRole(source)
  }

  return Array.from(new Set(roles))
}

/**
 * Checks if extracted roles or email indicate an Educator / Unit Head / Boss role
 */
export function isLeadershipRole(roles: string[], email?: string): boolean {
  const leadershipKeywords = [
    "boss",
    "educator",
    "unit_head",
    "unit-head",
    "unithead",
    "lead",
    "admin",
    "executive",
    "director",
  ]
  const hasRole = roles.some((r) => leadershipKeywords.includes(r.toLowerCase()))
  if (hasRole) return true

  // If role is explicitly normal learner/public, it is NOT leadership
  const isExplicitLearner = roles.some((r) => r === "aam_public" || r === "learner")
  if (isExplicitLearner) return false

  if (email) {
    const normalized = email.toLowerCase()
    return (
      normalized.includes("lead") ||
      normalized.includes("head") ||
      normalized.includes("educator") ||
      normalized.includes("boss")
    )
  }
  return false
}

/**
 * Safely decodes a standard JWT payload without external dependencies
 */
export function decodeJwtPayload(token?: string): Record<string, unknown> | null {
  if (!token || typeof token !== "string") return null
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const payloadStr = Buffer.from(parts[1], "base64url").toString("utf8")
    return JSON.parse(payloadStr)
  } catch {
    return null
  }
}

/**
 * Synchronizes users and roles dynamically from SELISE Blocks IAM via CLI
 */
export async function syncBlocksRolesFromCli(): Promise<Map<string, UserRole>> {
  const now = Date.now()
  if (now - lastSyncTime < SYNC_INTERVAL_MS && blocksRoleCache.size > 0) {
    return blocksRoleCache
  }
  lastSyncTime = now

  try {
    const envPaths = [
      process.env.PATH || "",
      "/Users/rahat/.npm-global/bin",
      "/usr/local/bin",
      "/opt/homebrew/bin",
    ].join(":")

    const { stdout } = await execAsync("blocks iam users list --json", {
      env: { ...process.env, PATH: envPaths },
      timeout: 5000,
    })

    const jsonStart = stdout.indexOf("{")
    const jsonEnd = stdout.lastIndexOf("}")
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1))
      if (Array.isArray(parsed?.data)) {
        for (const u of parsed.data) {
          if (!u.email) continue
          const userEmail = String(u.email).toLowerCase().trim()
          const roles = extractRoles(u.roles)
          const isHead = isLeadershipRole(roles, userEmail)
          const assignedRole: UserRole = isHead ? "UNIT_HEAD" : "LEARNER"

          blocksRoleCache.set(userEmail, assignedRole)
          memoryStore.userRoles.set(userEmail, assignedRole)

          // Update registered user in memoryStore if exists
          const existingUser = memoryStore.users.get(userEmail)
          if (existingUser) {
            existingUser.role = assignedRole
            if (isHead) {
              if (!existingUser.discipline || existingUser.discipline === "Product Track" || existingUser.discipline === "Active Track") {
                existingUser.discipline = "Leadership & Strategy"
              }
            } else {
              if (existingUser.discipline === "Leadership & Strategy") {
                existingUser.discipline = "Product Track"
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Blocks IAM CLI role sync (using cached roles):", err instanceof Error ? err.message : err)
  }

  return blocksRoleCache
}

/**
 * Resolves the accurate Blocks IAM role for a given user email
 */
export async function resolveUserBlocksRole(email: string): Promise<UserRole> {
  const normalized = email.toLowerCase().trim()

  // Attempt live sync from Blocks IAM
  await syncBlocksRolesFromCli()

  const cached = blocksRoleCache.get(normalized)
  if (cached) {
    memoryStore.userRoles.set(normalized, cached)
    return cached
  }

  // Fallback to userRoles map
  const memoryRole = memoryStore.userRoles.get(normalized)
  if (memoryRole) return memoryRole

  // Fallback to registered user store
  const existing = memoryStore.users.get(normalized)
  if (existing?.role) return existing.role

  // Fallback to keyword matching if email indicates leadership
  if (isLeadershipRole([], normalized)) {
    return "UNIT_HEAD"
  }

  return "LEARNER"
}
