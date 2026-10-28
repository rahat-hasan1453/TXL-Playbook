import { execFile } from "child_process"
import fs from "fs"
import path from "path"
import { promisify } from "util"
import type { Topic } from "@/lib/curriculumData"
import { loadCurriculumFromDisk } from "@/lib/curriculum-store"
import { CustomGoal, LearningPlan, PlanItem, goalsOn, localParts } from "@/lib/learning-plan"
import { getPlan, getAllPlans, savePlan } from "@/lib/plan-store"
import { getAllLearners, getLearnerProgress } from "@/lib/progress-store"
import { serviceClient, serviceConfigured } from "@/lib/blocks-service"
import { createReminderToken } from "@/lib/reminder-token"

const execFileAsync = promisify(execFile)

// Blocks Mail template that renders the daily reminder (saved with `blocks mail template save`)
export const REMINDER_MAIL_PURPOSE = "TxlDailyLearningReminder"

const OUTBOX_FILE = path.join(process.cwd(), ".data", "reminder-outbox.json")

export interface DayDigest {
  date: string
  topics: Array<{ item: PlanItem; topic: Topic; completed: boolean }>
  goals: Array<{ goal: CustomGoal; done: boolean }>
  missedCount: number
}

async function topicIndex(): Promise<Map<string, Topic>> {
  return new Map((await loadCurriculumFromDisk()).flatMap((d) => d.topics.map((t) => [t.id, t] as const)))
}

/** Everything the learner was meant to do on `date`, with what is already done. */
export async function buildDayDigest(plan: LearningPlan, date: string): Promise<DayDigest> {
  const progress = await getLearnerProgress(plan.email)
  const topics = await topicIndex()
  const checked = new Set(plan.goalChecks[date] || [])
  return {
    date,
    topics: plan.items
      .filter((i) => i.date === date && topics.has(i.topicId))
      .map((item) => ({ item, topic: topics.get(item.topicId)!, completed: progress[item.topicId] === "COMPLETED" })),
    goals: goalsOn(plan, date).map((goal) => ({ goal, done: checked.has(goal.id) })),
    missedCount: plan.items.filter(
      (i) => i.date < date && topics.has(i.topicId) && progress[i.topicId] !== "COMPLETED"
    ).length,
  }
}

function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/+$/, "")
}

export function reminderLinks(email: string, date: string) {
  const token = createReminderToken(email, date)
  const checklistUrl = `${appBaseUrl()}/reminder/${token}`
  return { checklistUrl, doneAllUrl: `${checklistUrl}?all=1` }
}

function formatDateLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

async function learnerName(email: string): Promise<string> {
  const learner = (await getAllLearners()).find((l) => l.email === email)
  return learner?.name || email.split("@")[0]
}

interface OutboxEntry {
  to: string
  date: string
  sentAt: string
  status: "sent" | "logged" | "failed"
  error?: string
  context: Record<string, string>
}

function recordOutbox(entry: OutboxEntry) {
  try {
    const existing: OutboxEntry[] = fs.existsSync(OUTBOX_FILE) ? JSON.parse(fs.readFileSync(OUTBOX_FILE, "utf-8")) : []
    fs.mkdirSync(path.dirname(OUTBOX_FILE), { recursive: true })
    fs.writeFileSync(OUTBOX_FILE, JSON.stringify([entry, ...existing].slice(0, 200), null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to write reminder outbox:", err)
  }
}

async function sendViaBlocksMail(to: string, context: Record<string, string>) {
  // Hosted deployments have no CLI, so they send through the SDK as the service user
  if (serviceConfigured()) {
    await serviceClient.mail.send({
      to: [to],
      purpose: REMINDER_MAIL_PURPOSE,
      language: "en-US",
      subjectDataContext: context,
      bodyDataContext: context,
    })
    return
  }
  const env = {
    ...process.env,
    PATH: [process.env.PATH || "", `${process.env.HOME}/.npm-global/bin`, "/usr/local/bin", "/opt/homebrew/bin"].join(":"),
  }
  const contextJson = JSON.stringify(context)
  await execFileAsync(
    "blocks",
    [
      "mail", "send",
      "--to", to,
      "--purpose", REMINDER_MAIL_PURPOSE,
      "--language", "en-US",
      "--subject-data-context", contextJson,
      "--body-data-context", contextJson,
      "--yes", "--json",
    ],
    { env, timeout: 20000 }
  )
}

export type SendResult =
  | { status: "sent" | "logged"; checklistUrl: string }
  | { status: "failed"; checklistUrl: string; error: string }
  | { status: "nothing-due" }

/** Sends the reminder for one learner and one day. */
export async function sendDailyReminder(plan: LearningPlan, date: string): Promise<SendResult> {
  const digest = await buildDayDigest(plan, date)
  const pendingTopics = digest.topics.filter((t) => !t.completed)
  const pendingGoals = digest.goals.filter((g) => !g.done)
  if (!pendingTopics.length && !pendingGoals.length) return { status: "nothing-due" }

  const { checklistUrl, doneAllUrl } = reminderLinks(plan.email, date)
  const lines = [
    ...pendingTopics.map((t) => `${t.topic.title} (${t.item.kind === "COMPULSORY" ? "Compulsory" : "Career track"})`),
    ...pendingGoals.map((g) => `${g.goal.title} (Personal goal)`),
  ]
  const context: Record<string, string> = {
    "Reminder.Name": await learnerName(plan.email),
    "Reminder.DateLabel": formatDateLabel(date),
    "Reminder.Count": String(lines.length),
    "Reminder.Items": lines.join("  ·  "),
    "Reminder.Missed": digest.missedCount
      ? `You also have ${digest.missedCount} missed topic${digest.missedCount === 1 ? "" : "s"} waiting in your plan.`
      : "",
    "Reminder.ChecklistUrl": checklistUrl,
    "Reminder.DoneAllUrl": doneAllUrl,
  }

  const base = { to: plan.email, date, sentAt: new Date().toISOString(), context }
  if (process.env.REMINDER_MAIL_MODE === "log") {
    recordOutbox({ ...base, status: "logged" })
    return { status: "logged", checklistUrl }
  }
  try {
    await sendViaBlocksMail(plan.email, context)
    recordOutbox({ ...base, status: "sent" })
    return { status: "sent", checklistUrl }
  } catch (err) {
    const error = err instanceof Error ? err.message.split("\n")[0] : String(err)
    recordOutbox({ ...base, status: "failed", error })
    return { status: "failed", checklistUrl, error }
  }
}

let runInFlight = false
const RETRY_AFTER_MS = 15 * 60 * 1000
const lastFailureAt = new Map<string, number>()

/** Sends today's reminder to every learner whose reminder time has passed and who hasn't had one yet. */
export async function runDueReminders(now: Date = new Date()) {
  if (runInFlight) return { sent: 0 }
  runInFlight = true
  let sent = 0
  try {
    for (const plan of await getAllPlans()) {
      const local = localParts(plan.timezone, now)
      if (local.date < plan.startDate || local.date > plan.endDate) continue
      if (local.time < plan.reminderTime || plan.lastReminderDate === local.date) continue
      if (now.getTime() - (lastFailureAt.get(plan.email) || 0) < RETRY_AFTER_MS) continue

      const result = await sendDailyReminder(plan, local.date)
      if (result.status === "failed") {
        console.warn(`Reminder to ${plan.email} failed:`, result.error)
        lastFailureAt.set(plan.email, now.getTime())
        continue
      }
      lastFailureAt.delete(plan.email)
      // Re-read so a learner's edits made while the mail was sending aren't overwritten
      const latest = await getPlan(plan.email)
      if (latest) await savePlan({ ...latest, lastReminderDate: local.date })
      if (result.status !== "nothing-due") sent++
    }
  } finally {
    runInFlight = false
  }
  return { sent }
}
