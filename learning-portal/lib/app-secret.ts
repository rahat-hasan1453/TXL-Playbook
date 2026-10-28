import crypto from "crypto"
import fs from "fs"
import path from "path"

// Server-side signing secret shared by session cookies and reminder links.
// Production must supply APP_SECRET (or REMINDER_LINK_SECRET); development generates one on disk.

const SECRET_FILE = path.join(process.cwd(), ".data", ".reminder-secret")
let cachedSecret: string | null = null

export function getSecret(): string {
  if (cachedSecret) return cachedSecret
  const fromEnv = (process.env.APP_SECRET || process.env.REMINDER_LINK_SECRET)
  if (fromEnv && fromEnv.length >= 16) {
    cachedSecret = fromEnv
    return cachedSecret
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_SECRET must be set (16+ characters) in production")
  }
  // Development: keep a generated secret on disk so links survive dev-server restarts
  try {
    if (fs.existsSync(SECRET_FILE)) {
      cachedSecret = fs.readFileSync(SECRET_FILE, "utf-8").trim()
    }
  } catch {}
  if (!cachedSecret) {
    cachedSecret = crypto.randomBytes(32).toString("hex")
    try {
      fs.mkdirSync(path.dirname(SECRET_FILE), { recursive: true })
      fs.writeFileSync(SECRET_FILE, cachedSecret, { encoding: "utf-8", mode: 0o600 })
    } catch {}
  }
  return cachedSecret
}

