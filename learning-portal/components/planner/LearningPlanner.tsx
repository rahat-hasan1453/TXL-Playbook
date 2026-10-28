"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Bell,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flame,
  GripVertical,
  Send,
  Settings2,
  Snowflake,
  Star,
  Target,
} from "lucide-react"
import type { Domain, Topic } from "@/lib/curriculumData"
import {
  LearningPlan,
  PlanItem,
  PlanSettings,
  addDays,
  goalsOn,
  todayIn,
  weekdayOf,
} from "@/lib/learning-plan"
import PlanWizard from "./PlanWizard"
import { announceReward, onReward } from "@/lib/reward-events"
import { XP_RULES, type GameSummary } from "@/lib/gamification"
import { COMPULSORY_COLOR, TRACK_COLORS, topicTrack, trackColor } from "@/lib/track-colors"

interface LearningPlannerProps {
  domains: Domain[]
  progressState: Record<string, "COMPLETED" | "IN_PROGRESS">
  onSetTopicCompleted: (topicId: string, completed: boolean) => void
  onOpenNotes: (topic: Topic) => void
}

const WEEK_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function monthKey(date: string) {
  return date.slice(0, 7)
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number)
  const d = new Date(Date.UTC(y, m - 1 + delta, 1))
  return d.toISOString().slice(0, 7)
}

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { timeZone: "UTC", month: "long", year: "numeric" })
}

/** The 6×7 grid of dates shown for a month, starting on Sunday. */
function monthGrid(month: string): string[] {
  const first = `${month}-01`
  const start = addDays(first, -weekdayOf(first))
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

export default function LearningPlanner({ domains, progressState, onSetTopicCompleted, onOpenNotes }: LearningPlannerProps) {
  const [plan, setPlan] = useState<LearningPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [month, setMonth] = useState<string | null>(null)
  const [showMissed, setShowMissed] = useState(false)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ tone: "ok" | "warn"; text: string; link?: string } | null>(null)
  const [sending, setSending] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [summary, setSummary] = useState<GameSummary | null>(null)

  const today = todayIn(plan?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC")

  const topicsById = useMemo(
    () => new Map(domains.flatMap((d) => d.topics.map((t) => [t.id, t] as const))),
    [domains]
  )
  const completedIds = useMemo(
    () => new Set(Object.keys(progressState).filter((id) => progressState[id] === "COMPLETED")),
    [progressState]
  )

  useEffect(() => {
    fetch("/api/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data?.plan || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const load = () =>
      fetch("/api/game")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setSummary(data))
        .catch(() => {})
    load()
    return onReward(load)
  }, [])

  useEffect(() => {
    if (plan && !month) {
      setMonth(monthKey(today >= plan.startDate && today <= plan.endDate ? today : plan.startDate))
    }
  }, [plan, month, today])

  const itemsByDate = useMemo(() => {
    const map = new Map<string, PlanItem[]>()
    plan?.items.forEach((item) => {
      if (!topicsById.has(item.topicId)) return
      map.set(item.date, [...(map.get(item.date) || []), item])
    })
    return map
  }, [plan, topicsById])

  const isMissed = useCallback(
    (item: PlanItem) => item.date < today && !completedIds.has(item.topicId),
    [today, completedIds]
  )

  const missedItems = useMemo(
    () => (plan?.items || []).filter((i) => topicsById.has(i.topicId) && isMissed(i)),
    [plan, topicsById, isMissed]
  )

  const patchPlan = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || "Could not update plan")
    setPlan(data.plan)
    announceReward(data.reward)
  }

  const handleSubmitSettings = async (settings: PlanSettings) => {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || "Could not create plan")
    setPlan(data.plan)
    setMonth(monthKey(settings.startDate))
    setEditing(false)
  }

  const handleDeletePlan = async () => {
    await fetch("/api/plan", { method: "DELETE" })
    setPlan(null)
    setMonth(null)
    setEditing(false)
  }

  const moveItem = (itemId: string, date: string) => {
    if (!plan) return
    const item = plan.items.find((i) => i.id === itemId)
    if (!item || item.date === date || date < plan.startDate) return
    const previous = plan
    setPlan({ ...plan, items: plan.items.map((i) => (i.id === itemId ? { ...i, date } : i)) })
    patchPlan({ action: "moveItem", itemId, date }).catch(() => setPlan(previous))
  }

  const toggleGoal = (goalId: string, date: string, done: boolean) => {
    if (!plan) return
    const previous = plan
    const checked = new Set(plan.goalChecks[date] || [])
    if (done) checked.add(goalId)
    else checked.delete(goalId)
    setPlan({ ...plan, goalChecks: { ...plan.goalChecks, [date]: Array.from(checked) } })
    patchPlan({ action: "toggleGoal", goalId, date, done }).catch(() => setPlan(previous))
  }

  const sendTestReminder = async () => {
    setSending(true)
    setNotice(null)
    try {
      const res = await fetch("/api/reminders/run", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Could not send reminder")
      if (data.status === "sent") setNotice({ tone: "ok", text: "Reminder sent to your email.", link: data.checklistUrl })
      else if (data.status === "logged")
        setNotice({ tone: "ok", text: "Mail mode is \"log\": the reminder was written to the outbox instead of sent.", link: data.checklistUrl })
      else if (data.status === "nothing-due") setNotice({ tone: "ok", text: "Nothing left to do today, so no reminder was needed." })
      else setNotice({ tone: "warn", text: `Email could not be sent: ${data.error}`, link: data.checklistUrl })
    } catch (err) {
      setNotice({ tone: "warn", text: err instanceof Error ? err.message : "Could not send reminder" })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="p-16 text-center text-xs text-zinc-500">Loading your plan…</div>
  }

  if (!plan || editing) {
    return (
      <PlanWizard
        domains={domains}
        completedTopicIds={completedIds}
        existingPlan={plan}
        onSubmit={handleSubmitSettings}
        onDelete={handleDeletePlan}
        onClose={plan ? () => setEditing(false) : undefined}
      />
    )
  }

  const currentMonth = month || monthKey(plan.startDate)
  const canGoBack = currentMonth > monthKey(plan.startDate)
  const canGoForward = currentMonth < monthKey(plan.endDate)
  const selected = selectedDate || today

  const dayState = (date: string) => {
    const items = itemsByDate.get(date) || []
    const goals = goalsOn(plan, date)
    const checked = new Set(plan.goalChecks[date] || [])
    const allDone =
      items.length + goals.length > 0 &&
      items.every((i) => completedIds.has(i.topicId)) &&
      goals.every((g) => checked.has(g.id))
    const missed = date < today && items.some((i) => !completedIds.has(i.topicId))
    return { items, goals, checked, allDone, missed }
  }

  // Days in the visible month that have something planned, and how many of them are fully done
  const monthDates = monthGrid(currentMonth).filter((d) => monthKey(d) === currentMonth && (itemsByDate.get(d)?.length || 0) > 0)
  const monthDone = monthDates.filter((d) => dayState(d).allDone).length

  const itemColor = (item: PlanItem) => {
    const topic = topicsById.get(item.topicId)!
    return item.kind === "COMPULSORY" ? COMPULSORY_COLOR.bar : trackColor(topicTrack(topic.roles, plan.tracks) || "ALL").bar
  }

  const sel = dayState(selected)
  const selDate = new Date(`${selected}T00:00:00Z`)
  const selLabel = selDate.toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" })
  const selDay = Math.round((selDate.getTime() - Date.parse(`${plan.startDate}T00:00:00Z`)) / 86_400_000) + 1
  const selPendingXp =
    sel.items.filter((i) => !completedIds.has(i.topicId)).length * XP_RULES.topic +
    sel.goals.filter((g) => !sel.checked.has(g.id)).length * XP_RULES.goal

  const pendingCount =
    sel.items.filter((i) => !completedIds.has(i.topicId)).length +
    (selected <= today ? sel.goals.filter((g) => !sel.checked.has(g.id)).length : 0)

  const finishDay = () => {
    sel.items.filter((i) => !completedIds.has(i.topicId)).forEach((i) => onSetTopicCompleted(i.topicId, true))
    if (selected <= today) sel.goals.filter((g) => !sel.checked.has(g.id)).forEach((g) => toggleGoal(g.id, selected, true))
  }

  const stat = (icon: React.ReactNode, value: string, label: string) => (
    <div className="flex items-center gap-3 bg-[#121316] border border-zinc-800/80 border-b-4 rounded-2xl px-4 py-3">
      {icon}
      <div>
        <p className="text-xl font-extrabold text-white leading-tight">{value}</p>
        <p className="text-[11px] text-zinc-400 font-medium">{label}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-[#121316] p-5 rounded-2xl border border-zinc-800/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-blue-400" /> My Learning Plan
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                {plan.startDate} → {plan.endDate} · {plan.tracks.join(" + ")}
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 text-xs font-medium hover:bg-zinc-700 transition flex items-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5" /> Edit plan
            </button>
          </div>
        </div>
        <div className="lg:w-80 bg-[#121316] p-5 rounded-2xl border border-zinc-800/80 space-y-2">
          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Bell className="w-3 h-3" /> Daily email at {plan.reminderTime} ({plan.timezone})
          </p>
          <button
            onClick={sendTestReminder}
            disabled={sending}
            className="w-full px-3 py-1.5 rounded-lg bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 text-xs font-medium hover:bg-zinc-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> {sending ? "Sending…" : "Send today's reminder now"}
          </button>
          {notice && (
            <p className={`text-[11px] ${notice.tone === "ok" ? "text-emerald-300" : "text-amber-300"}`}>
              {notice.text}{" "}
              {notice.link && (
                <a href={notice.link} target="_blank" rel="noreferrer" className="underline hover:text-white">
                  Open checklist
                </a>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stat(<Flame className="w-7 h-7 text-orange-400" />, String(summary?.streak ?? 0), "Day streak")}
        {stat(<CalendarCheck className="w-7 h-7 text-emerald-400" />, `${monthDone} / ${monthDates.length}`, "Days completed this month")}
        {stat(
          <Snowflake className="w-7 h-7 text-sky-400" />,
          summary?.freezeAvailable === false ? "0" : "1",
          "Streak freeze this week"
        )}
      </div>

      {/* Calendar */}
      <div className="bg-[#121316] rounded-2xl border border-zinc-800/80 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => canGoBack && setMonth(shiftMonth(currentMonth, -1))}
              disabled={!canGoBack}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-extrabold text-white w-40 text-center">{monthLabel(currentMonth)}</h2>
            <button
              onClick={() => canGoForward && setMonth(shiftMonth(currentMonth, 1))}
              disabled={!canGoForward}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowMissed((v) => !v)}
            aria-pressed={showMissed}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
              showMissed ? "bg-red-950/60 text-red-200 border-red-700/60" : "bg-zinc-900 text-zinc-300 border-zinc-700/60 hover:border-zinc-500"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Missed ({missedItems.length})
          </button>
        </div>

        {showMissed && (
          <div className="mb-3 p-3 rounded-xl border border-red-900/50 bg-red-950/10">
            {missedItems.length === 0 ? (
              <p className="text-xs text-zinc-400">No missed topics. Nice work!</p>
            ) : (
              <>
                <p className="text-xs text-zinc-400 mb-2">Drag a missed topic onto an upcoming day to reschedule it.</p>
                <div className="flex flex-wrap gap-2">
                  {missedItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", item.id)
                        e.dataTransfer.effectAllowed = "move"
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-950/40 border border-red-800/60 text-[11px] text-zinc-100 cursor-grab"
                    >
                      <GripVertical className="w-3 h-3 text-red-300/70" />
                      {topicsById.get(item.topicId)?.title}
                      <span className="text-red-300/70">· {item.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEK_HEADER.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wide text-zinc-500 pb-1">
              {d}
            </div>
          ))}
          {monthGrid(currentMonth).map((date) => {
            const inMonth = monthKey(date) === currentMonth
            const inPlan = date >= plan.startDate && date <= plan.endDate
            const state = dayState(date)
            const isToday = date === today
            const isSelected = date === selected
            const pendingGoals = state.goals.filter((g) => !state.checked.has(g.id)).length
            return (
              <div
                key={date}
                data-date={date}
                role="button"
                tabIndex={inMonth ? 0 : -1}
                aria-label={`${date}${isToday ? ", today" : ""}${state.allDone ? ", completed" : state.missed ? ", missed" : ""}, ${state.items.length} topics`}
                aria-pressed={isSelected}
                onClick={() => inMonth && setSelectedDate(date)}
                onKeyDown={(e) => {
                  if (inMonth && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    setSelectedDate(date)
                  }
                }}
                onDragOver={(e) => {
                  if (date < plan.startDate) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  if (dragOverDate !== date) setDragOverDate(date)
                }}
                onDragLeave={() => setDragOverDate((d) => (d === date ? null : d))}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOverDate(null)
                  const itemId = e.dataTransfer.getData("text/plain")
                  if (itemId) moveItem(itemId, date)
                }}
                className={`min-h-[72px] md:min-h-[104px] rounded-xl border border-b-4 p-1.5 md:p-2 flex flex-col gap-1 text-left transition cursor-pointer ${
                  !inMonth ? "opacity-30 pointer-events-none" : ""
                } ${
                  state.allDone
                    ? "bg-amber-950/50 border-amber-600/70"
                    : inPlan
                    ? "bg-[#0e0f12] border-zinc-800 hover:border-zinc-600"
                    : "bg-transparent border-zinc-900"
                } ${isSelected ? "!border-sky-500 ring-2 ring-sky-500/40" : ""} ${
                  dragOverDate === date ? "!border-sky-400 bg-sky-950/40" : ""
                } ${showMissed && !state.missed && inMonth ? "opacity-40" : ""}`}
              >
                <div className="flex items-center justify-between gap-1">
                  {isToday ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-orange-500 text-black rounded-md px-1.5 py-0.5">
                      Today
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        state.allDone ? "text-amber-300" : state.missed ? "text-red-400" : "text-zinc-400"
                      }`}
                    >
                      {state.allDone && <Check className="w-3 h-3 stroke-[3]" />}
                      {Number(date.slice(8))}
                    </span>
                  )}
                  {pendingGoals > 0 && date <= today && <Target className="w-3 h-3 text-amber-400" aria-label="Personal goal due" />}
                </div>

                {/* Desktop: topic names with a colour stripe. Mobile: dots. */}
                <div className="hidden md:flex flex-col gap-1">
                  {state.items.map((item) => {
                    const done = completedIds.has(item.topicId)
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", item.id)
                          e.dataTransfer.effectAllowed = "move"
                        }}
                        title={`${topicsById.get(item.topicId)?.title} · drag to move`}
                        className="flex items-stretch gap-1.5 cursor-grab active:cursor-grabbing"
                      >
                        <span className={`w-[3px] shrink-0 rounded-full ${itemColor(item)}`} aria-hidden="true" />
                        <span
                          className={`text-[11px] leading-snug line-clamp-2 ${
                            done ? "text-zinc-500 line-through" : "text-zinc-100"
                          }`}
                        >
                          {topicsById.get(item.topicId)?.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex md:hidden flex-wrap gap-1 mt-auto">
                  {state.items.map((item) => (
                    <span
                      key={item.id}
                      className={`w-2 h-2 rounded-full ${completedIds.has(item.topicId) ? "bg-zinc-600" : itemColor(item)}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 px-1 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Day completed</span>
          <span className="flex items-center gap-1.5"><span className="w-[3px] h-3 rounded-full bg-blue-500" /> Compulsory</span>
          {plan.tracks.map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className={`w-[3px] h-3 rounded-full ${TRACK_COLORS[t].bar}`} /> {t}
            </span>
          ))}
          <span className="text-red-400">Red date = missed</span>
          <span className="text-zinc-500">· Drag a topic onto another day to move it</span>
        </div>
      </div>

      {/* Selected day */}
      <div className="bg-[#121316] rounded-2xl border border-zinc-800/80 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 className="text-lg font-extrabold text-white">
            {selected === today ? "Today · " : ""}
            {selLabel}
          </h3>
          <span className="text-xs text-zinc-400">
            {sel.items.length || sel.goals.length ? `Day ${selDay} of your plan` : "Nothing planned"}
          </span>
        </div>

        {sel.items.length === 0 && sel.goals.length === 0 ? (
          <p className="text-sm text-zinc-400">A free day. Pick another date, or drag a topic here to plan it.</p>
        ) : (
          <div className="space-y-2">
            {sel.items.map((item) => {
              const topic = topicsById.get(item.topicId)!
              const done = completedIds.has(item.topicId)
              const track = topicTrack(topic.roles, plan.tracks)
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.id)
                    e.dataTransfer.effectAllowed = "move"
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 border-b-4 bg-[#0e0f12]"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white on-solid ${
                      done ? "bg-emerald-500" : itemColor(item)
                    }`}
                  >
                    {done ? <Check className="w-5 h-5 stroke-[3]" /> : item.kind === "COMPULSORY" ? <Star className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onOpenNotes(topic)}
                      className={`text-sm font-bold text-left hover:underline ${done ? "text-zinc-400 line-through" : "text-white"}`}
                    >
                      {topic.title}
                    </button>
                    <p className="text-[11px] text-zinc-400">
                      {item.kind === "COMPULSORY" ? "Compulsory" : track || "Career track"} · +{XP_RULES.topic} XP
                    </p>
                  </div>
                  <button
                    role="checkbox"
                    aria-checked={done}
                    aria-label={`${done ? "Mark not done" : "Mark done"}: ${topic.title}`}
                    onClick={() => onSetTopicCompleted(item.topicId, !done)}
                    className={`shrink-0 w-9 h-9 rounded-xl border-2 border-b-4 flex items-center justify-center transition ${
                      done
                        ? "bg-emerald-500 border-emerald-700 text-black"
                        : "bg-transparent border-zinc-600 hover:border-emerald-500 text-transparent hover:text-emerald-500/50"
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              )
            })}
            {sel.goals.map((goal) => {
              const done = sel.checked.has(goal.id)
              const canTick = selected <= today
              return (
                <div key={goal.id} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 border-b-4 bg-[#0e0f12]">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white on-solid ${done ? "bg-emerald-500" : "bg-amber-600"}`}
                  >
                    {done ? <Check className="w-5 h-5 stroke-[3]" /> : <Target className="w-5 h-5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${done ? "text-zinc-400 line-through" : "text-white"}`}>{goal.title}</p>
                    <p className="text-[11px] text-zinc-400">Personal goal · +{XP_RULES.goal} XP</p>
                  </div>
                  {canTick && (
                    <button
                      role="checkbox"
                      aria-checked={done}
                      aria-label={`${done ? "Mark not done" : "Mark done"}: ${goal.title}`}
                      onClick={() => toggleGoal(goal.id, selected, !done)}
                      className={`shrink-0 w-9 h-9 rounded-xl border-2 border-b-4 flex items-center justify-center transition ${
                        done
                          ? "bg-emerald-500 border-emerald-700 text-black"
                          : "bg-transparent border-zinc-600 hover:border-emerald-500 text-transparent hover:text-emerald-500/50"
                      }`}
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </button>
                  )}
                </div>
              )
            })}
            {/* "Studied everything" only helps when more than one thing is still open */}
            {pendingCount > 1 && selPendingXp > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={finishDay}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black border-b-4 border-emerald-700 active:border-b-0 active:translate-y-0.5 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark all done +{selPendingXp} XP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
