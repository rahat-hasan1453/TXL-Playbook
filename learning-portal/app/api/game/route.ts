import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "@/lib/auth"
import { getGameSummary, updateGamePrefs } from "@/lib/game-store"
import { DAILY_GOAL_OPTIONS } from "@/lib/gamification"

const prefsSchema = z.object({
  dailyGoal: z
    .number()
    .refine((n) => (DAILY_GOAL_OPTIONS as readonly number[]).includes(n), "Unsupported daily goal")
    .optional(),
  timezone: z.string().min(1).max(64).optional(),
})

function isValidTimezone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz })
    return true
  } catch {
    return false
  }
}

async function requireLearner() {
  const { user } = await getServerSession()
  if (!user) return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) }
  if (user.role !== "LEARNER") return { error: NextResponse.json({ error: "Only learners earn XP" }, { status: 403 }) }
  return { user }
}

export async function GET() {
  const auth = await requireLearner()
  if ("error" in auth) return auth.error
  return NextResponse.json(await getGameSummary(auth.user.email, auth.user.name, auth.user.avatar))
}

export async function PATCH(req: Request) {
  const auth = await requireLearner()
  if ("error" in auth) return auth.error
  const parsed = prefsSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 })
  }
  if (parsed.data.timezone && !isValidTimezone(parsed.data.timezone)) {
    return NextResponse.json({ error: "Unknown timezone" }, { status: 400 })
  }
  await updateGamePrefs(auth.user.email, parsed.data)
  return NextResponse.json(await getGameSummary(auth.user.email))
}
