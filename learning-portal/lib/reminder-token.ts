import crypto from "crypto"
import { getSecret } from "@/lib/app-secret"
import { addDays, isIsoDate } from "@/lib/learning-plan"

// Signed, login-free links for the daily reminder email. A token lets its holder
// view and tick off one learner's plan for one day, and nothing else.

const VALID_DAYS_AFTER = 7

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url")
}

export function createReminderToken(email: string, date: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email.toLowerCase(), d: date })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function verifyReminderToken(token: string, today: string): { email: string; date: string } | null {
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null
  try {
    const { e, d } = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"))
    if (typeof e !== "string" || typeof d !== "string" || !isIsoDate(d)) return null
    if (today > addDays(d, VALID_DAYS_AFTER)) return null
    return { email: e, date: d }
  } catch {
    return null
  }
}
