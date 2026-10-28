import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "@/lib/auth"
import { loadCurriculumFromDisk } from "@/lib/curriculum-store"
import { getLearnerProgress } from "@/lib/progress-store"
import { deletePlan, getPlan, savePlan } from "@/lib/plan-store"
import {
  LearningPlan,
  MAX_TRACKS,
  PLAN_TRACKS,
  buildSchedule,
  isIsoDate,
  planEndDate,
} from "@/lib/learning-plan"

const goalSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().trim().min(1).max(120),
  frequency: z.enum(["DAILY", "TWICE_WEEKLY"]),
  days: z.array(z.number().int().min(0).max(6)).max(7),
})

const settingsSchema = z.object({
  startDate: z.string().refine(isIsoDate, "Invalid start date"),
  durationMonths: z.union([z.literal(1), z.literal(2)]),
  tracks: z.array(z.enum(PLAN_TRACKS)).min(1).max(MAX_TRACKS),
  customGoals: z
    .array(goalSchema)
    .max(10)
    .refine(
      (goals) => goals.every((g) => g.frequency === "DAILY" || new Set(g.days).size === 2),
      "Twice-weekly goals need exactly two weekdays"
    ),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timezone: z.string().min(1).max(64),
})

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("moveItem"),
    itemId: z.string(),
    date: z.string().refine(isIsoDate, "Invalid date"),
  }),
  z.object({
    action: z.literal("toggleGoal"),
    goalId: z.string(),
    date: z.string().refine(isIsoDate, "Invalid date"),
    done: z.boolean(),
  }),
  z.object({
    action: z.literal("updateReminder"),
    reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    timezone: z.string().min(1).max(64),
  }),
])

async function requireLearner() {
  const session = await getServerSession()
  if (!session.user) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) }
  }
  if (session.user.role !== "LEARNER") {
    return { error: NextResponse.json({ error: "Only learners can plan" }, { status: 403 }) }
  }
  return { email: session.user.email.toLowerCase() }
}

function isValidTimezone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz })
    return true
  } catch {
    return false
  }
}

export async function GET() {
  const auth = await requireLearner()
  if ("error" in auth) return auth.error
  return NextResponse.json({ plan: await getPlan(auth.email) })
}

// Create or regenerate the plan from the wizard settings
export async function POST(req: Request) {
  const auth = await requireLearner()
  if ("error" in auth) return auth.error

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid plan settings" }, { status: 400 })
  }
  const settings = parsed.data
  if (!isValidTimezone(settings.timezone)) {
    return NextResponse.json({ error: "Unknown timezone" }, { status: 400 })
  }

  const progress = await getLearnerProgress(auth.email)
  const completed = new Set(Object.keys(progress).filter((id) => progress[id] === "COMPLETED"))
  const tracks = Array.from(new Set(settings.tracks))
  const now = new Date().toISOString()
  const existing = await getPlan(auth.email)

  const plan: LearningPlan = {
    email: auth.email,
    startDate: settings.startDate,
    endDate: planEndDate(settings.startDate, settings.durationMonths),
    durationMonths: settings.durationMonths,
    tracks,
    customGoals: settings.customGoals.map((g) => ({
      ...g,
      days: g.frequency === "DAILY" ? [] : Array.from(new Set(g.days)).sort(),
    })),
    reminderTime: settings.reminderTime,
    timezone: settings.timezone,
    items: buildSchedule(await loadCurriculumFromDisk(), { ...settings, tracks }, completed),
    goalChecks: existing?.goalChecks || {},
    lastReminderDate: existing?.lastReminderDate,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  return NextResponse.json({ plan: await savePlan(plan) })
}

export async function PATCH(req: Request) {
  const auth = await requireLearner()
  if ("error" in auth) return auth.error

  const plan = await getPlan(auth.email)
  if (!plan) return NextResponse.json({ error: "No plan yet" }, { status: 404 })

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 })
  }
  const body = parsed.data

  if (body.action === "moveItem") {
    const item = plan.items.find((i) => i.id === body.itemId)
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 })
    if (body.date < plan.startDate) {
      return NextResponse.json({ error: "Can't move a topic before the plan starts" }, { status: 400 })
    }
    item.date = body.date
    // Moving a topic past the last day stretches the plan to cover it
    if (body.date > plan.endDate) plan.endDate = body.date
  } else if (body.action === "toggleGoal") {
    if (!plan.customGoals.some((g) => g.id === body.goalId)) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }
    const checked = new Set(plan.goalChecks[body.date] || [])
    if (body.done) checked.add(body.goalId)
    else checked.delete(body.goalId)
    if (checked.size) plan.goalChecks[body.date] = Array.from(checked)
    else delete plan.goalChecks[body.date]
  } else {
    if (!isValidTimezone(body.timezone)) {
      return NextResponse.json({ error: "Unknown timezone" }, { status: 400 })
    }
    plan.reminderTime = body.reminderTime
    plan.timezone = body.timezone
  }

  return NextResponse.json({ plan: await savePlan(plan) })
}

export async function DELETE() {
  const auth = await requireLearner()
  if ("error" in auth) return auth.error
  await deletePlan(auth.email)
  return NextResponse.json({ success: true })
}
