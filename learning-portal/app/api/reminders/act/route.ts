import { NextResponse } from "next/server"
import { z } from "zod"
import { todayIn } from "@/lib/learning-plan"
import { getPlan, savePlan } from "@/lib/plan-store"
import { updateLearnerTopicProgress } from "@/lib/progress-store"
import { buildDayDigest } from "@/lib/reminders"
import { verifyReminderToken } from "@/lib/reminder-token"
import { awardXp } from "@/lib/game-store"

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
  const plan = await getPlan(claims.email)
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  const digest = await buildDayDigest(plan, claims.date)
  const setTopic = async (topicId: string, done: boolean) => {
    await updateLearnerTopicProgress(plan.email, topicId, done ? "COMPLETED" : "NOT_STARTED")
    if (done) await awardXp(plan.email, "topic", topicId)
  }
  const goalAwards: string[] = []
  const setGoal = (goalId: string, done: boolean) => {
    if (done) goalAwards.push(goalId)
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
    await setTopic(body.topicId, body.done)
  } else if (body.action === "goal") {
    if (!digest.goals.some((g) => g.goal.id === body.goalId)) {
      return NextResponse.json({ error: "That goal is not scheduled for this day" }, { status: 404 })
    }
    setGoal(body.goalId, body.done)
  } else {
    for (const t of digest.topics) await setTopic(t.topic.id, true)
    for (const g of digest.goals) setGoal(g.goal.id, true)
  }

  await savePlan(plan)
  for (const goalId of goalAwards) await awardXp(plan.email, "goal", `${goalId}:${claims.date}`)
  const latest = (await getPlan(claims.email)) || plan
  return NextResponse.json({ digest: await buildDayDigest(latest, claims.date) })
}
