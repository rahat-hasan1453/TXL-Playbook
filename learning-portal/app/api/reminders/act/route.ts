import { NextResponse } from "next/server"
import { z } from "zod"
import { todayIn } from "@/lib/learning-plan"
import { getPlan, savePlan } from "@/lib/plan-store"
import { updateLearnerTopicProgress } from "@/lib/progress-store"
import { buildDayDigest } from "@/lib/reminders"
import { verifyReminderToken } from "@/lib/reminder-token"

const actSchema = z.discriminatedUnion("action", [
  z.object({ token: z.string(), action: z.literal("topic"), topicId: z.string(), done: z.boolean() }),
  z.object({ token: z.string(), action: z.literal("goal"), goalId: z.string(), done: z.boolean() }),
  z.object({ token: z.string(), action: z.literal("all") }),
])

// Ticks off items from the reminder email's checklist page. Auth is the signed link
// token, which only covers the one learner and the one day it was issued for.
export async function POST(req: Request) {
  const parsed = actSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  const body = parsed.data

  const claims = verifyReminderToken(body.token, todayIn("UTC"))
  if (!claims) return NextResponse.json({ error: "This link has expired" }, { status: 401 })
  const plan = getPlan(claims.email)
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  const digest = buildDayDigest(plan, claims.date)
  const setTopic = (topicId: string, done: boolean) =>
    updateLearnerTopicProgress(plan.email, topicId, done ? "COMPLETED" : "NOT_STARTED")
  const setGoal = (goalId: string, done: boolean) => {
    const checked = new Set(plan.goalChecks[claims.date] || [])
    if (done) checked.add(goalId)
    else checked.delete(goalId)
    if (checked.size) plan.goalChecks[claims.date] = Array.from(checked)
    else delete plan.goalChecks[claims.date]
  }

  if (body.action === "topic") {
    if (!digest.topics.some((t) => t.topic.id === body.topicId)) {
      return NextResponse.json({ error: "That topic is no longer scheduled for this day" }, { status: 404 })
    }
    setTopic(body.topicId, body.done)
  } else if (body.action === "goal") {
    if (!digest.goals.some((g) => g.goal.id === body.goalId)) {
      return NextResponse.json({ error: "That goal is not scheduled for this day" }, { status: 404 })
    }
    setGoal(body.goalId, body.done)
  } else {
    digest.topics.forEach((t) => setTopic(t.topic.id, true))
    digest.goals.forEach((g) => setGoal(g.goal.id, true))
  }

  savePlan(plan)
  return NextResponse.json({ digest: buildDayDigest(getPlan(claims.email)!, claims.date) })
}
