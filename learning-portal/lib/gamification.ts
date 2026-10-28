import type { Domain } from "@/lib/curriculumData"
import { addDays, weekdayOf } from "@/lib/learning-plan"

// Shared (client + server) game rules. XP is only ever awarded on the server.

export const XP_RULES = {
  topic: 10, // finishing a curriculum topic (once per topic)
  note: 5, // first note on a topic
  share: 5, // posting a takeaway to the team feed
  goal: 5, // ticking off a personal goal (once per goal per day)
} as const

export type XpEventKind = keyof typeof XP_RULES

export const DAILY_GOAL_OPTIONS = [10, 20, 30, 50] as const
export const DEFAULT_DAILY_GOAL = 20
export const DEFAULT_TIMEZONE = "Asia/Dhaka"

export interface GameState {
  email: string
  name: string
  avatar: string
  xp: number
  // weekStart (Monday, "YYYY-MM-DD") -> XP earned that week
  weeklyXp: Record<string, number>
  // date -> XP earned that day (also the record of active days)
  dailyXp: Record<string, number>
  // ids of events already rewarded, so nothing pays out twice
  events: string[]
  dailyGoal: number
  timezone: string
  counts: { topics: number; notes: number; shares: number; goals: number }
  createdAt: string
}

// ---------- levels ----------

const LEVELS = [
  { xp: 0, title: "Newcomer" },
  { xp: 50, title: "Explorer" },
  { xp: 120, title: "Practitioner" },
  { xp: 220, title: "Builder" },
  { xp: 350, title: "Specialist" },
  { xp: 520, title: "Strategist" },
  { xp: 740, title: "Expert" },
  { xp: 1000, title: "Mentor" },
  { xp: 1300, title: "Leader" },
  { xp: 1650, title: "TXL Master" },
]

export function levelFor(xp: number) {
  let index = 0
  LEVELS.forEach((l, i) => {
    if (xp >= l.xp) index = i
  })
  const current = LEVELS[index]
  const next = LEVELS[index + 1]
  return {
    level: index + 1,
    title: current.title,
    xpIntoLevel: xp - current.xp,
    xpForNext: next ? next.xp - current.xp : 0,
    isMax: !next,
  }
}

// ---------- weeks & streaks ----------

/** Monday of the week containing `date`. */
export function weekStart(date: string): string {
  return addDays(date, -((weekdayOf(date) + 6) % 7))
}

/**
 * Consecutive active days ending today (or yesterday, since today isn't over yet).
 * One missed day per week is forgiven automatically (a "streak freeze").
 */
export function computeStreak(dailyXp: Record<string, number>, today: string) {
  const active = (d: string) => (dailyXp[d] || 0) > 0
  const frozenWeeks = new Set<string>()
  const frozenDays: string[] = []
  let streak = 0
  let day = active(today) ? today : addDays(today, -1)

  for (let i = 0; i < 3650; i++) {
    if (active(day)) {
      streak++
    } else {
      const week = weekStart(day)
      // Only bridge a gap that sits between active days
      if (!frozenWeeks.has(week) && streak > 0 && active(addDays(day, -1))) {
        frozenWeeks.add(week)
        frozenDays.push(day)
      } else {
        break
      }
    }
    day = addDays(day, -1)
  }

  const freezeUsedThisWeek = frozenDays.some((d) => weekStart(d) === weekStart(today))
  return { streak, frozenDays, freezeAvailable: !freezeUsedThisWeek, activeToday: active(today) }
}

// ---------- badges ----------

export interface BadgeDef {
  id: string
  title: string
  description: string
  emoji: string
}

export interface BadgeContext {
  state: GameState
  streak: number
  completedTopicIds: Set<string>
  domains: Domain[]
}

const STATIC_BADGES: Array<BadgeDef & { test: (c: BadgeContext) => boolean }> = [
  { id: "first-topic", title: "First Step", description: "Finish your first topic", emoji: "🌱", test: (c) => c.state.counts.topics >= 1 },
  { id: "topics-10", title: "On a Roll", description: "Finish 10 topics", emoji: "📚", test: (c) => c.state.counts.topics >= 10 },
  { id: "topics-25", title: "Deep Diver", description: "Finish 25 topics", emoji: "🧠", test: (c) => c.state.counts.topics >= 25 },
  { id: "streak-3", title: "Warming Up", description: "Reach a 3-day streak", emoji: "🔥", test: (c) => c.streak >= 3 },
  { id: "streak-7", title: "Week Strong", description: "Reach a 7-day streak", emoji: "⚡", test: (c) => c.streak >= 7 },
  { id: "streak-30", title: "Unstoppable", description: "Reach a 30-day streak", emoji: "🏆", test: (c) => c.streak >= 30 },
  { id: "notes-5", title: "Note Taker", description: "Write notes on 5 topics", emoji: "✍️", test: (c) => c.state.counts.notes >= 5 },
  { id: "share-1", title: "Team Player", description: "Share a takeaway with your team", emoji: "🤝", test: (c) => c.state.counts.shares >= 1 },
  { id: "goals-10", title: "Habit Builder", description: "Tick off 10 personal goals", emoji: "🎯", test: (c) => c.state.counts.goals >= 10 },
]

export function badgeDefinitions(domains: Domain[]): BadgeDef[] {
  return [
    ...STATIC_BADGES.map(({ test: _test, ...b }) => b),
    ...domains.map((d) => ({
      id: `domain-${d.id}`,
      title: `${d.name} Complete`,
      description: `Finish every topic in ${d.name}`,
      emoji: "🎖️",
    })),
  ]
}

export function earnedBadgeIds(ctx: BadgeContext): string[] {
  const earned = STATIC_BADGES.filter((b) => b.test(ctx)).map((b) => b.id)
  for (const d of ctx.domains) {
    if (d.topics.length && d.topics.every((t) => ctx.completedTopicIds.has(t.id))) earned.push(`domain-${d.id}`)
  }
  return earned
}

// ---------- API shapes ----------

export interface GameSummary {
  xp: number
  level: ReturnType<typeof levelFor>
  streak: number
  freezeAvailable: boolean
  activeToday: boolean
  todayXp: number
  dailyGoal: number
  weekXp: number
  badges: Array<BadgeDef & { earned: boolean }>
  today: string
}

export interface Reward {
  xpGained: number
  totalXp: number
  streak: number
  levelUp: { level: number; title: string } | null
  newBadges: BadgeDef[]
  dailyGoalReached: boolean
}

export interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  level: number
  levelTitle: string
  weekXp: number
  streak: number
  isYou: boolean
}
