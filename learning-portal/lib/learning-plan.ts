import type { Domain, Topic } from "@/lib/curriculumData"

// Shared (client + server) types and pure helpers for the learning planner.
// Dates are calendar days in the learner's own timezone, stored as "YYYY-MM-DD".

export const PLAN_TRACKS = ["Consultant", "Service Designer", "AI PM", "Engineer"] as const
export type PlanTrack = (typeof PLAN_TRACKS)[number]

export const MAX_TRACKS = 2

export type GoalFrequency = "DAILY" | "TWICE_WEEKLY"

export interface CustomGoal {
  id: string
  title: string
  frequency: GoalFrequency
  // Weekdays (0 = Sunday … 6 = Saturday); only used for TWICE_WEEKLY
  days: number[]
}

export type PlanItemKind = "COMPULSORY" | "TRACK"

export interface PlanItem {
  id: string
  topicId: string
  date: string
  kind: PlanItemKind
}

export interface LearningPlan {
  email: string
  startDate: string
  endDate: string
  durationMonths: 1 | 2
  tracks: PlanTrack[]
  customGoals: CustomGoal[]
  reminderTime: string // "HH:mm" in the learner's timezone
  timezone: string // IANA zone, e.g. "Asia/Dhaka"
  items: PlanItem[]
  // date -> ids of custom goals the learner ticked off that day
  goalChecks: Record<string, string[]>
  lastReminderDate?: string
  createdAt: string
  updatedAt: string
}

export interface PlanSettings {
  startDate: string
  durationMonths: 1 | 2
  tracks: PlanTrack[]
  customGoals: CustomGoal[]
  reminderTime: string
  timezone: string
}

// ---------- date helpers (UTC arithmetic on calendar days) ----------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function addMonths(date: string, months: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  const day = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  d.setUTCDate(Math.min(day, lastDay))
  return d.toISOString().slice(0, 10)
}

export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

export function daysBetween(start: string, end: string): string[] {
  const out: string[] = []
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d)
  return out
}

/** Today's calendar date in the given IANA timezone. */
export function todayIn(timezone: string, now: Date = new Date()): string {
  return localParts(timezone, now).date
}

/** Calendar date and "HH:mm" wall-clock time in the given timezone. */
export function localParts(timezone: string, now: Date = new Date()): { date: string; time: string } {
  let parts: Intl.DateTimeFormatPart[]
  try {
    parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now)
  } catch {
    return localParts("UTC", now)
  }
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00"
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  }
}

// ---------- scheduling ----------

export function planEndDate(startDate: string, durationMonths: 1 | 2): string {
  return addDays(addMonths(startDate, durationMonths), -1)
}

/** Topics everyone must learn, in curriculum order. */
export function compulsoryTopics(domains: Domain[]): Topic[] {
  return domains.flatMap((d) => d.topics).filter((t) => t.roles.includes("Everyone"))
}

/**
 * Specialist topics for the chosen career tracks. With two tracks the topics are
 * interleaved so both tracks move forward together instead of one after the other.
 */
export function trackTopics(domains: Domain[], tracks: PlanTrack[]): Topic[] {
  const all = domains.flatMap((d) => d.topics).filter((t) => !t.roles.includes("Everyone"))
  const perTrack = tracks.map((track) => all.filter((t) => t.roles.includes(track)))
  const seen = new Set<string>()
  const out: Topic[] = []
  const longest = Math.max(0, ...perTrack.map((list) => list.length))
  for (let i = 0; i < longest; i++) {
    for (const list of perTrack) {
      const topic = list[i]
      if (topic && !seen.has(topic.id)) {
        seen.add(topic.id)
        out.push(topic)
      }
    }
  }
  return out
}

/** Spread `count` items evenly across `dayCount` days; returns a day index per item. */
function spread(count: number, dayCount: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.floor((i * dayCount) / count))
}

/**
 * Builds the day-by-day schedule: compulsory topics and career-track topics are each
 * spread evenly over the plan, so a typical day holds one compulsory topic and one
 * track topic. Topics already completed are left out.
 */
export function buildSchedule(
  domains: Domain[],
  settings: Pick<PlanSettings, "startDate" | "durationMonths" | "tracks">,
  completedTopicIds: Set<string>
): PlanItem[] {
  const days = daysBetween(settings.startDate, planEndDate(settings.startDate, settings.durationMonths))
  const compulsory = compulsoryTopics(domains).filter((t) => !completedTopicIds.has(t.id))
  const compulsoryIds = new Set(compulsory.map((t) => t.id))
  const track = trackTopics(domains, settings.tracks).filter(
    (t) => !completedTopicIds.has(t.id) && !compulsoryIds.has(t.id)
  )

  const items: PlanItem[] = []
  spread(compulsory.length, days.length).forEach((dayIdx, i) => {
    items.push({ id: `pi-${compulsory[i].id}`, topicId: compulsory[i].id, date: days[dayIdx], kind: "COMPULSORY" })
  })
  spread(track.length, days.length).forEach((dayIdx, i) => {
    items.push({ id: `pi-${track[i].id}`, topicId: track[i].id, date: days[dayIdx], kind: "TRACK" })
  })
  return items.sort((a, b) => a.date.localeCompare(b.date) || a.kind.localeCompare(b.kind))
}

/** Custom goals that fall on a given date. */
export function goalsOn(plan: Pick<LearningPlan, "customGoals" | "startDate" | "endDate">, date: string): CustomGoal[] {
  if (date < plan.startDate || date > plan.endDate) return []
  const weekday = weekdayOf(date)
  return plan.customGoals.filter((g) => g.frequency === "DAILY" || g.days.includes(weekday))
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
