"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, FileText, Play, RotateCcw, Star, Target, Undo2 } from "lucide-react"
import type { Domain, Topic } from "@/lib/curriculumData"
import { DAILY_GOAL_OPTIONS, GameSummary, XP_RULES } from "@/lib/gamification"
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
    },
  ]
  for (const domain of domains) {
    const topics = domain.topics.filter((t) => !compulsoryIds.has(t.id) && tracks.some((tr) => t.roles.includes(tr)))
    if (topics.length) {
      units.push({ id: `unit-${domain.id}`, title: domain.name, subtitle: domain.focus, compulsory: false, topics })
    }
  }
  return units
}

export default function SkillPath({ domains, progressState, onSetTopicCompleted, onOpenNotes, onCreatePlan }: SkillPathProps) {
  const [plan, setPlan] = useState<LearningPlan | null | undefined>(undefined)
  const [summary, setSummary] = useState<GameSummary | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
    loadSummary()
    return onReward(loadSummary)
  }, [loadSummary])

  const units = useMemo(() => (plan ? buildUnits(domains, plan.tracks) : []), [domains, plan])
  const ordered = useMemo(() => units.flatMap((u) => u.topics), [units])
  const isDone = (id: string) => progressState[id] === "COMPLETED"
  const currentId = ordered.find((t) => !isDone(t.id))?.id || null
  const selected = ordered.find((t) => t.id === (selectedId || currentId)) || null
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
      <section className="flex-1 min-w-0 w-full" aria-label="Learning path">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your Learning Path</h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              {doneCount} of {ordered.length} topics · {plan.tracks.join(" + ")}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {units.map((unit) => {
            const unitColor = unit.compulsory ? COMPULSORY_COLOR : null
            const unitDone = unit.topics.filter((t) => isDone(t.id)).length
            return (
              <div key={unit.id}>
                <div
                  className={`rounded-2xl px-5 py-4 border flex items-center justify-between gap-4 ${
                    unitColor ? unitColor.card : "bg-[#121316] border-zinc-800/80"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 flex items-center gap-1.5">
                      {unit.compulsory && <Star className="w-3 h-3 text-blue-400" />}
                      {unit.compulsory ? "Compulsory" : "Career track"}
                    </p>
                    <h2 className="text-base font-bold text-white mt-0.5">{unit.title}</h2>
                    <p className="text-xs text-zinc-400 line-clamp-1">{unit.subtitle}</p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 shrink-0">
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
                    const isSelected = selected?.id === topic.id
                    return (
                      <li key={topic.id} style={{ transform: `translateX(${OFFSETS[index % OFFSETS.length]}px)` }}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(topic.id)}
                          aria-label={`${topic.title}${done ? ", completed" : current ? ", up next" : ""}`}
                          aria-pressed={isSelected}
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
                            } ${isSelected ? "ring-4 ring-white/30" : ""}`}
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
      <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-4">
        {selected && (
          <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              {selected.roles.includes("Everyone") ? "Compulsory topic" : "Career track topic"}
            </p>
            <h3 className="text-lg font-bold text-white mt-1 leading-snug">{selected.title}</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{selected.description}</p>
            <div className="mt-4 flex flex-col gap-2">
              {isDone(selected.id) ? (
                <button
                  onClick={() => onSetTopicCompleted(selected.id, false)}
                  className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-1.5"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Mark as not done
                </button>
              ) : (
                <button
                  onClick={() => onSetTopicCompleted(selected.id, true)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> I studied this · +{XP_RULES.topic} XP
                </button>
              )}
              <button
                onClick={() => onOpenNotes(selected)}
                className="w-full px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 hover:bg-zinc-700 flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Open notes · first note +{XP_RULES.note} XP
              </button>
              {selectedId && selectedId !== currentId && currentId && (
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Back to next topic
                </button>
              )}
            </div>
          </div>
        )}

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
