import { loadCurriculumFromDisk } from "@/lib/curriculum-store"
import {
  DEFAULT_DAILY_GOAL,
  DEFAULT_TIMEZONE,
  GameState,
  GameSummary,
  LeaderboardEntry,
  Reward,
  XP_RULES,
  XpEventKind,
  badgeDefinitions,
  computeStreak,
  earnedBadgeIds,
  levelFor,
  weekStart,
} from "@/lib/gamification"
import { todayIn } from "@/lib/learning-plan"
import { kvGetJson, kvListJson, kvSetJson } from "@/lib/kv"
import { getLearnerProgress } from "@/lib/progress-store"

const PREFIX = "game:"
const keyFor = (email: string) => `${PREFIX}${email.toLowerCase().trim()}`

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "LN"
  )
}

/** Loads a learner's game state, creating it (with credit for topics already finished) on first use. */
export async function getGameState(
  email: string,
  name?: string,
  avatar?: string,
  // A topic being completed right now earns XP through awardXp, not as back-credit
  pendingTopicId?: string
): Promise<GameState> {
  const key = email.toLowerCase().trim()
  const existing = await kvGetJson<GameState>(keyFor(key))
  if (existing) {
    let changed = false
    if (name && existing.name !== name) (existing.name = name), (changed = true)
    if (avatar && existing.avatar !== avatar) (existing.avatar = avatar), (changed = true)
    if (changed) await kvSetJson(keyFor(key), existing)
    return existing
  }

  const progress = await getLearnerProgress(key)
  const done = Object.keys(progress).filter((id) => progress[id] === "COMPLETED" && id !== pendingTopicId)
  const displayName = name || key.split("@")[0]
  const state: GameState = {
    email: key,
    name: displayName,
    avatar: avatar || initials(displayName),
    xp: done.length * XP_RULES.topic,
    weeklyXp: {},
    dailyXp: {},
    events: done.map((id) => `topic:${id}`),
    dailyGoal: DEFAULT_DAILY_GOAL,
    timezone: DEFAULT_TIMEZONE,
    counts: { topics: done.length, notes: 0, shares: 0, goals: 0 },
    createdAt: new Date().toISOString(),
  }
  await kvSetJson(keyFor(key), state)
  return state
}

async function badgeIds(state: GameState, streak: number) {
  const progress = await getLearnerProgress(state.email)
  const completed = new Set(Object.keys(progress).filter((id) => progress[id] === "COMPLETED"))
  return earnedBadgeIds({ state, streak, completedTopicIds: completed, domains: await loadCurriculumFromDisk() })
}

/**
 * Awards XP for an event, at most once per eventKey. Returns what changed so the UI can celebrate,
 * or null when the event was already rewarded.
 */
export async function awardXp(
  email: string,
  kind: XpEventKind,
  eventKey: string,
  profile?: { name?: string; avatar?: string }
): Promise<Reward | null> {
  const state = await getGameState(email, profile?.name, profile?.avatar, kind === "topic" ? eventKey : undefined)
  const eventId = `${kind}:${eventKey}`
  if (state.events.includes(eventId)) return null

  const today = todayIn(state.timezone)
  const before = computeStreak(state.dailyXp, today).streak
  const levelBefore = levelFor(state.xp).level
  const badgesBefore = new Set(await badgeIds(state, before))
  const todayBefore = state.dailyXp[today] || 0

  const amount = XP_RULES[kind]
  state.events.push(eventId)
  state.xp += amount
  state.dailyXp[today] = todayBefore + amount
  const week = weekStart(today)
  state.weeklyXp[week] = (state.weeklyXp[week] || 0) + amount
  if (kind === "topic") state.counts.topics++
  else if (kind === "note") state.counts.notes++
  else if (kind === "share") state.counts.shares++
  else state.counts.goals++

  await kvSetJson(keyFor(email), state)

  const streak = computeStreak(state.dailyXp, today).streak
  const level = levelFor(state.xp)
  const defs = badgeDefinitions(await loadCurriculumFromDisk())
  const newBadgeIds = (await badgeIds(state, streak)).filter((id) => !badgesBefore.has(id))

  return {
    xpGained: amount,
    totalXp: state.xp,
    streak: Math.max(streak, before),
    levelUp: level.level > levelBefore ? { level: level.level, title: level.title } : null,
    newBadges: defs.filter((d) => newBadgeIds.includes(d.id)),
    dailyGoalReached: todayBefore < state.dailyGoal && state.dailyXp[today] >= state.dailyGoal,
  }
}

export async function updateGamePrefs(email: string, prefs: { dailyGoal?: number; timezone?: string }) {
  const state = await getGameState(email)
  if (prefs.dailyGoal) state.dailyGoal = prefs.dailyGoal
  if (prefs.timezone) state.timezone = prefs.timezone
  await kvSetJson(keyFor(email), state)
  return state
}

export async function getGameSummary(email: string, name?: string, avatar?: string): Promise<GameSummary> {
  const state = await getGameState(email, name, avatar)
  const today = todayIn(state.timezone)
  const { streak, freezeAvailable, activeToday } = computeStreak(state.dailyXp, today)
  const earned = new Set(await badgeIds(state, streak))
  return {
    xp: state.xp,
    level: levelFor(state.xp),
    streak,
    freezeAvailable,
    activeToday,
    todayXp: state.dailyXp[today] || 0,
    dailyGoal: state.dailyGoal,
    weekXp: state.weeklyXp[weekStart(today)] || 0,
    badges: badgeDefinitions(await loadCurriculumFromDisk()).map((b) => ({ ...b, earned: earned.has(b.id) })),
    today,
  }
}

/**
 * This week's ranking. Deliberately carries only public, aggregate fields:
 * no topic ids, progress or notes ever leave the server through here.
 */
export async function getWeeklyLeaderboard(viewerEmail: string): Promise<LeaderboardEntry[]> {
  const viewer = viewerEmail.toLowerCase()
  const states = await kvListJson<GameState>(PREFIX)
  return states
    .map((s) => {
      const today = todayIn(s.timezone || DEFAULT_TIMEZONE)
      const level = levelFor(s.xp)
      return {
        email: s.email,
        name: s.name,
        avatar: s.avatar,
        level: level.level,
        levelTitle: level.title,
        weekXp: s.weeklyXp[weekStart(today)] || 0,
        streak: computeStreak(s.dailyXp, today).streak,
      }
    })
    .sort((a, b) => b.weekXp - a.weekXp || b.streak - a.streak || a.name.localeCompare(b.name))
    .map(({ email, ...entry }, i) => ({ ...entry, rank: i + 1, isYou: email === viewer }))
}

/** Folds several rewards from one request into one, for a single celebration. */
export function mergeRewards(rewards: Array<Reward | null>): Reward | null {
  const real = rewards.filter((r): r is Reward => !!r)
  if (!real.length) return null
  const last = real[real.length - 1]
  return {
    xpGained: real.reduce((n, r) => n + r.xpGained, 0),
    totalXp: last.totalXp,
    streak: Math.max(...real.map((r) => r.streak)),
    levelUp: real.reduce<Reward["levelUp"]>((acc, r) => r.levelUp || acc, null),
    newBadges: real.flatMap((r) => r.newBadges),
    dailyGoalReached: real.some((r) => r.dailyGoalReached),
  }
}
