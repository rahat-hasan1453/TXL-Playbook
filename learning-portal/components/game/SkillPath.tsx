"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, Check, FileText, Play, Star, Target, Trophy, Undo2, X } from "lucide-react"
import type { Domain, Topic } from "@/lib/curriculumData"
import { DAILY_GOAL_OPTIONS, GameSummary, LeaderboardEntry, XP_RULES } from "@/lib/gamification"
import { LearningPlan, compulsoryTopics } from "@/lib/learning-plan"
import { COMPULSORY_COLOR, topicTrack, trackColor } from "@/lib/track-colors"
import { onReward } from "@/lib/reward-events"

interface SkillPathProps {
  domains: Domain[]
  progressState: Record<string, "COMPLETED" | "IN_PROGRESS">
  onSetTopicCompleted: (topicId: string, completed: boolean) => void
  onOpenNotes: (topic: Topic) => void
  onCreatePlan: () => void
}

interface PathUnit {
  id: string
  title: string
  subtitle: string
  compulsory: boolean
  topics: Topic[]
  banner: string
}

// Gentle zig-zag, Duolingo style
const OFFSETS = [0, 44, 72, 44, 0, -44, -72, -44]

function buildUnits(domains: Domain[], tracks: string[]): PathUnit[] {
  const compulsory = compulsoryTopics(domains)
  const compulsoryIds = new Set(compulsory.map((t) => t.id))
  const units: PathUnit[] = [
    {
      id: "unit-compulsory",
      title: "Foundations",
      subtitle: "Compulsory for every role",
      compulsory: true,
      topics: compulsory,
      banner: COMPULSORY_COLOR.banner,
    },
  ]
  for (const domain of domains) {
    const topics = domain.topics.filter((t) => !compulsoryIds.has(t.id) && tracks.some((tr) => t.roles.includes(tr)))
    if (topics.length) {
      // The unit takes the colour of the chosen track most of its topics belong to
      const counts = new Map<string, number>()
      topics.forEach((t) => {
        const tr = topicTrack(t.roles, tracks)
        if (tr) counts.set(tr, (counts.get(tr) || 0) + 1)
      })
      const main = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "ALL"
      units.push({
        id: `unit-${domain.id}`,
        title: domain.name,
        subtitle: domain.focus,
        compulsory: false,
        topics,
        banner: trackColor(main).banner,
      })
    }
  }
  return units
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

  const units = useMemo(() => (plan ? buildUnits(domains, plan.tracks) : []), [domains, plan])
  const ordered = useMemo(() => units.flatMap((u) => u.topics), [units])
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

  let index = -1
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
          {units.map((unit) => {
                    const unitDone = unit.topics.filter((t) => isDone(t.id)).length
            return (
              <div key={unit.id}>
                <div
                  className={`sticky top-[72px] z-30 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 text-white shadow-lg border-b-4 border-black/25 ${unit.banner}`}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/80 flex items-center gap-1.5">
                      {unit.compulsory && <Star className="w-3 h-3 fill-current" />}
                      {unit.compulsory ? "Compulsory" : "Career track"}
                    </p>
                    <h2 className="text-base sm:text-lg font-extrabold mt-0.5">{unit.title}</h2>
                    <p className="text-xs text-white/80 line-clamp-1">{unit.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold bg-black/20 rounded-lg px-2.5 py-1">
                    {unitDone}/{unit.topics.length}
                  </span>
                </div>

                <ol className="flex flex-col items-center gap-10 py-8">
                  {unit.topics.map((topic) => {
                    index++
                    const done = isDone(topic.id)
                    const current = topic.id === currentId
                    const track = topicTrack(topic.roles, plan.tracks)
                    const color = unit.compulsory ? COMPULSORY_COLOR.bar : trackColor(track || "ALL").bar
                    const isOpen = openId === topic.id
                    return (
                      <li
                        key={topic.id}
                        id={`node-${topic.id}`}
                        data-path-node
                        className={`relative scroll-mt-40 ${isOpen ? "z-20" : ""}`}
                        style={{ transform: `translateX(${OFFSETS[index % OFFSETS.length]}px)` }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : topic.id)}
                          aria-label={`${topic.title}${done ? ", completed" : current ? ", up next" : ""}`}
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
                                ? "bg-emerald-500 border-emerald-700 text-white"
                                : current
                                ? `${color} border-black/30 text-white node-current`
                                : "bg-zinc-800 border-zinc-900 text-zinc-500"
                            } ${isOpen ? "ring-4 ring-white/30" : ""}`}
                          >
                            {done ? (
                              <Check className="w-7 h-7 stroke-[3]" />
                            ) : current ? (
                              <Play className="w-6 h-6 fill-current" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </span>
                          <span
                            className={`mt-2 max-w-[160px] text-center text-[11px] font-semibold leading-tight ${
                              done ? "text-zinc-400" : current ? "text-white" : "text-zinc-500"
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
                                {unit.compulsory ? "Compulsory" : track || "Career track"} · Topic {index + 1} of {ordered.length}
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
