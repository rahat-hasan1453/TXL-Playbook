import crypto from "crypto"
import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { todayIn } from "@/lib/learning-plan"
import { getPlan } from "@/lib/plan-store"
import { runDueReminders, sendDailyReminder } from "@/lib/reminders"

function hasCronSecret(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  const header = req.headers.get("authorization") || ""
  if (!secret || !header.startsWith("Bearer ")) return false
  const given = Buffer.from(header.slice("Bearer ".length))
  const expected = Buffer.from(secret)
  return given.length === expected.length && crypto.timingSafeEqual(given, expected)
}

// Vercel Cron calls this with GET and "Authorization: Bearer <CRON_SECRET>"
export async function GET(req: Request) {
  if (!hasCronSecret(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // Vercel's free plan runs this once a day, so it can't honour each learner's reminder time:
  // everyone who hasn't had today's reminder gets it on that run.
  return NextResponse.json(await runDueReminders(new Date(), { ignoreTime: true }))
}

/**
 * External cron: sends every reminder that is due (Authorization: Bearer <CRON_SECRET>).
 * Signed-in learner: sends today's reminder to themselves right now, for testing.
 */
export async function POST(req: Request) {
  if (hasCronSecret(req)) {
    return NextResponse.json(await runDueReminders())
  }

  const session = await getServerSession()
  if (!session.user || session.user.role !== "LEARNER") {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  const plan = await getPlan(session.user.email)
  if (!plan) return NextResponse.json({ error: "Create a learning plan first" }, { status: 404 })

  const result = await sendDailyReminder(plan, todayIn(plan.timezone))
  return NextResponse.json(result)
}
