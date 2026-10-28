"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, Check, FileText, Play, Star, Target, Trophy, Undo2, X } from "lucide-react"
import type { Domain, Topic } from "@/lib/curriculumData"
import { DAILY_GOAL_OPTIONS, GameSummary, LeaderboardEntry, XP_RULES } from "@/lib/gamification"
import { LearningPlan, todayIn } from "@/lib/learning-plan"
import { COMPULSORY_COLOR, topicTrack, trackColor } from "@/lib/track-colors"
import { onReward } from "@/lib/reward-events"

interface SkillPathProps {
  domains: Domain[]
  progressState: Record<string, "COMPLETED" | "IN_PROGRESS">
  onSetTopicCompleted: (topicId: string, completed: boolean) => void
  onOpenNotes: (topic: Topic) => void
  onCreatePlan: () => void
}

interface PathNode {
  topic: Topic
  kind: "COMPULSORY" | "TRACK"
  track: string | null
}

interface PathStep {
  key: string
  date: string
  day: number // 1-based day of the plan
  firstOfDay: boolean
  nodes: PathNode[] // one compulsory + one career-track topic
}

interface PathWeek {
  week: number
  steps: PathStep[]
}

// Gentle zig-zag, Duolingo style
const OFFSETS = [0, 44, 72, 44, 0, -44, -72, -44]

/**
 * The path follows the plan's own schedule: each day is one step holding that day's
 * compulsory topic and career-track topic side by side, grouped into weeks.
 */
function buildWeeks(plan: LearningPlan, topicsById: Map<string, Topic>): PathWeek[] {
  const byDate = new Map<string, PathNode[]>()
  for (const item of plan.items) {
    const topic = topicsById.get(item.topicId)
    if (!topic) continue
    const nodes = byDate.get(item.date) || []
    nodes.push({ topic, kind: item.kind, track: topicTrack(topic.roles, plan.tracks) })
    byDate.set(item.date, nodes)
  }
  const dates = [...byDate.keys()].sort()
  const start = plan.startDate
  const weeks: PathWeek[] = []
  for (const date of dates) {
    const day = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000) + 1
    const week = Math.max(1, Math.ceil(day / 7))
    const nodes = byDate.get(date)!
    // Pair the day's compulsory and track topics: one of each per step
    const comp = nodes.filter((n) => n.kind === "COMPULSORY")
    const trk = nodes.filter((n) => n.kind === "TRACK")
    let bucket = weeks[weeks.length - 1]
    if (!bucket || bucket.week !== week) {
      bucket = { week, steps: [] }
      weeks.push(bucket)
    }
    for (let i = 0; i < Math.max(comp.length, trk.length); i++) {
      bucket.steps.push({
        key: `${date}-${i}`,
        date,
        day,
        firstOfDay: i === 0,
        nodes: [comp[i], trk[i]].filter((n): n is PathNode => !!n),
      })
    }
  }
  return weeks
}

function dateLabel(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

export default function SkillPath({ domains, progressState, onSetTopicCompleted, onOpenNotes, onCreatePlan }: SkillPathProps) {
  const [plan, setPlan] = useState<LearningPlan | null | undefined>(undefined)
  const [summary, setSummary] = useState<GameSummary | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [me, setMe] = useState<LeaderboardEntry | null>(null)
  const pathRef = useRef<HTMLElement>(null)

  const loadSummary = useCallback(() => {
    fetch("/api/game")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSummary(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data?.plan || null))
      .catch(() => setPlan(null))
    const loadRank = () =>
      fetch("/api/leaderboard")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setMe((data?.entries as LeaderboardEntry[] | undefined)?.find((e) => e.isYou) || null))
        .catch(() => {})
    loadSummary()
    loadRank()
    return onReward(() => {
      loadSummary()
      loadRank()
    })
  }, [loadSummary])

  // Close the node popover on Escape or a click elsewhere
  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null)
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.("[data-path-node]")) setOpenId(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onDown)
    }
  }, [openId])

  const topicsById = useMemo(
    () => new Map(domains.flatMap((d) => d.topics.map((t) => [t.id, t] as const))),
    [domains]
  )
  const weeks = useMemo(() => (plan ? buildWeeks(plan, topicsById) : []), [plan, topicsById])
  const ordered = useMemo(() => weeks.flatMap((w) => w.steps.flatMap((st) => st.nodes.map((n) => n.topic))), [weeks])
  const isDone = (id: string) => progressState[id] === "COMPLETED"
  const currentId = ordered.find((t) => !isDone(t.id))?.id || null
  const currentTopic = ordered.find((t) => t.id === currentId) || null

  const jumpToCurrent = () => {
    if (!currentId) return
    document.getElementById(`node-${currentId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    setOpenId(currentId)
  }
  const doneCount = ordered.filter((t) => isDone(t.id)).length

  const setDailyGoal = (dailyGoal: number) => {
    fetch("/api/game", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dailyGoal }) })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSummary(data))
      .catch(() => {})
  }

  if (plan === undefined) {
    return <div className="p-16 text-center text-xs text-zinc-500">Loading your path…</div>
  }

  if (!plan) {
    return (
      <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-10 text-center max-w-xl mx-auto">
        <div className="text-4xl mb-3" aria-hidden="true">🗺️</div>
        <h2 className="text-xl font-bold text-white">Pick your tracks to unlock your path</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Your path starts with the compulsory foundations, then continues through the career tracks you choose.
        </p>
        <button
          onClick={onCreatePlan}
          className="mt-5 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold"
        >
          Set up my plan
        </button>
      </div>
    )
  }

  let stepIndex = -1
  const today = todayIn(plan.timezone)
  const goalPct = summary ? Math.min(100, Math.round((summary.todayXp / summary.dailyGoal) * 100)) : 0

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ---------- path ---------- */}
      <section ref={pathRef} className="flex-1 min-w-0 w-full" aria-label="Learning path">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your Learning Path</h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {doneCount} of {ordered.length} topics · {plan.tracks.join(" + ")}
            </p>
          </div>
          {currentTopic && (
            <button
              onClick={jumpToCurrent}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shadow"
            >
              <ArrowDown className="w-3.5 h-3.5" /> Continue: {currentTopic.title}
            </button>
          )}
        </div>

        <div className="space-y-8">
          {weeks.map((week) => {
            const weekTopics = week.steps.flatMap((st) => st.nodes)
            const weekDone = weekTopics.filter((n) => isDone(n.topic.id)).length
            return (
              <div key={week.week}>
                <div className="sticky top-[72px] z-30 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 bg-[#18191d] border border-zinc-700 border-b-4 shadow-lg">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                      {dateLabel(week.steps[0].date)} – {dateLabel(week.steps[week.steps.length - 1].date)}
                    </p>
                    <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">Week {week.week}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${COMPULSORY_COLOR.bar}`} /> Compulsory
                      </span>
                      {plan.tracks.map((t) => (
                        <span key={t} className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${trackColor(t).dot}`} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-zinc-200 bg-zinc-800 rounded-lg px-2.5 py-1">
                    {weekDone}/{weekTopics.length}
                  </span>
                </div>

                <ol className="flex flex-col items-center gap-12 py-10">
                  {week.steps.map((step) => {
                    stepIndex++
                    const isToday = step.date === today
                    // Each step is its own stacking context (transform), so the step with the open
                    // popover must sit above the steps after it
                    const stepOpen = step.nodes.some((n) => n.topic.id === openId)
                    return (
                      <li
                        key={step.key}
                        className={`relative flex flex-col items-center ${stepOpen ? "z-20" : "z-0"}`}
                        style={{ transform: `translateX(${OFFSETS[stepIndex % OFFSETS.length]}px)` }}
                      >
                        {step.firstOfDay && (
                          <span
                            className={`mb-9 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                              isToday ? "bg-white text-black" : "text-zinc-500"
                            }`}
                          >
                            {isToday ? "Today" : `Day ${step.day}`} · {dateLabel(step.date)}
                          </span>
                        )}
                        <div className="flex items-start gap-6">
                          {step.nodes.map((node) => {
                            const topic = node.topic
                            const done = isDone(topic.id)
                            const current = topic.id === currentId
                            const color = node.kind === "COMPULSORY" ? COMPULSORY_COLOR.bar : trackColor(node.track || "ALL").bar
                            const position = ordered.findIndex((t) => t.id === topic.id) + 1
                            const isOpen = openId === topic.id
                            return (
                              <div
                                key={topic.id}
                                id={`node-${topic.id}`}
                                data-path-node
                                className={`relative w-[120px] flex justify-center scroll-mt-40 ${isOpen ? "z-20" : ""}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setOpenId(isOpen ? null : topic.id)}
                                  aria-label={`${topic.title}, ${node.kind === "COMPULSORY" ? "compulsory" : node.track || "career track"}${
                                    done ? ", completed" : current ? ", up next" : ""
                                  }`}
                                  aria-expanded={isOpen}
                                  className="relative flex flex-col items-center group"
                                >
                                  {current && (
                                    <span className="absolute -top-8 whitespace-nowrap text-[10px] font-extrabold uppercase tracking-wide bg-amber-400 text-black px-2 py-1 rounded-lg">
                                      Start
                                    </span>
                                  )}
                                  <span
                                    className={`w-16 h-16 rounded-full flex items-center justify-center border-b-4 transition-transform group-hover:-translate-y-0.5 ${
                                      done
                                        ? "bg-emerald-500 border-emerald-700 text-white on-solid"
                                        : current
                                        ? `${color} border-black/30 text-white on-solid node-current`
                                        : `${color} border-black/30 text-white on-solid opacity-35`
                                    } ${isOpen ? "ring-4 ring-white/30" : ""}`}
                                  >
                                    {done ? (
                                      <Check className="w-7 h-7 stroke-[3]" />
                                    ) : current ? (
                                      <Play className="w-6 h-6 fill-current" />
                                    ) : node.kind === "COMPULSORY" ? (
                                      <Star className="w-6 h-6" />
                                    ) : (
                                      <span className="text-sm font-bold">{position}</span>
                                    )}
                                  </span>
                                  <span
                                    className={`mt-2 text-center text-[11px] font-semibold leading-tight line-clamp-2 ${
                                      done ? "text-zinc-400" : current ? "text-white" : "text-zinc-400"
                                    }`}
                                  >
                                    {topic.title}
                                  </span>
                                </button>

                                {isOpen && (
                                  <div
                                    role="dialog"
                                    aria-label={topic.title}
                                    className="reward-pop absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 rounded-2xl bg-[#18191d] border border-zinc-700 shadow-2xl p-4"
                                  >
                                    <span
                                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#18191d] border-l border-t border-zinc-700"
                                      aria-hidden="true"
                                    />
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                                        {node.kind === "COMPULSORY" ? "Compulsory" : node.track || "Career track"} · Topic {position} of{" "}
                                        {ordered.length}
                                      </p>
                                      <button
                                        onClick={() => setOpenId(null)}
                                        aria-label="Close"
                                        className="text-zinc-500 hover:text-white -mt-1 -mr-1 p-1"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <h3 className="text-base font-bold text-white mt-1 leading-snug">{topic.title}</h3>
                                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{topic.description}</p>
                                    <div className="mt-3 flex flex-col gap-2">
                                      {done ? (
                                        <button
                                          onClick={() => onSetTopicCompleted(topic.id, false)}
                                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-1.5"
                                        >
                                          <Undo2 className="w-3.5 h-3.5" /> Mark as not done
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            onSetTopicCompleted(topic.id, true)
                                            setOpenId(null)
                                          }}
                                          className="w-full px-3 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wide bg-emerald-500 hover:bg-emerald-400 text-black border-b-4 border-emerald-700 active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-1.5"
                                        >
                                          <Check className="w-4 h-4 stroke-[3]" /> I studied this +{XP_RULES.topic} XP
                                        </button>
                                      )}
                                      <button
                                        onClick={() => onOpenNotes(topic)}
                                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 hover:bg-zinc-700 flex items-center justify-center gap-1.5"
                                      >
                                        <FileText className="w-3.5 h-3.5" /> Notes · first note +{XP_RULES.note} XP
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- sidebar ---------- */}
      <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-4" aria-label="Progress">
        <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
          <span className="w-12 h-12 rounded-xl bg-amber-950/50 border border-amber-700/60 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-400" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">This week</p>
            {me && me.weekXp > 0 ? (
              <>
                <p className="text-sm font-bold text-white">You&apos;re ranked #{me.rank}</p>
                <p className="text-xs text-zinc-400">{me.weekXp} XP earned since Monday</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white">Join this week&apos;s leaderboard</p>
                <p className="text-xs text-zinc-400">Finish a topic to earn your first XP</p>
              </>
            )}
          </div>
        </div>

        {summary && (
          <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className={`text-xl font-extrabold ${summary.activeToday ? "text-orange-400" : "text-zinc-400"}`}>
                  🔥 {summary.streak}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">day streak</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-amber-300">⚡ {summary.xp}</p>
                <p className="text-[10px] text-zinc-500 font-medium">total XP</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-violet-300">Lv {summary.level.level}</p>
                <p className="text-[10px] text-zinc-500 font-medium">{summary.level.title}</p>
              </div>
            </div>

            {!summary.level.isMax && (
              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                  <span>Next level</span>
                  <span>
                    {summary.level.xpIntoLevel}/{summary.level.xpForNext} XP
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-violet-500 transition-all"
                    style={{ width: `${Math.round((summary.level.xpIntoLevel / summary.level.xpForNext) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" /> Daily goal
                </span>
                <span className="text-zinc-400">
                  {summary.todayXp}/{summary.dailyGoal} XP
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${goalPct}%` }} />
              </div>
              <div className="flex gap-1.5 mt-2.5" role="group" aria-label="Daily XP goal">
                {DAILY_GOAL_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setDailyGoal(g)}
                    aria-pressed={summary.dailyGoal === g}
                    className={`flex-1 py-1 rounded-md text-[11px] font-semibold border transition ${
                      summary.dailyGoal === g
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {summary.freezeAvailable
                ? "🧊 Streak freeze ready: missing one day this week won't break your streak."
                : "🧊 This week's streak freeze is used. Study every day to keep your streak."}
            </p>
          </div>
        )}

        {summary && (
          <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white">
              Badges{" "}
              <span className="text-zinc-500 font-medium">
                {summary.badges.filter((b) => b.earned).length}/{summary.badges.length}
              </span>
            </h3>
            <ul className="grid grid-cols-4 gap-2 mt-3">
              {summary.badges.map((b) => (
                <li
                  key={b.id}
                  title={`${b.title}: ${b.description}${b.earned ? "" : " (locked)"}`}
                  className={`aspect-square rounded-xl border flex items-center justify-center text-2xl ${
                    b.earned ? "bg-amber-950/40 border-amber-700/60" : "bg-zinc-900 border-zinc-800 grayscale opacity-40"
                  }`}
                >
                  <span aria-hidden="true">{b.emoji}</span>
                  <span className="sr-only">
                    {b.title}, {b.earned ? "earned" : "locked"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  )
}
