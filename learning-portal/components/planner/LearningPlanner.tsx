"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  FileText,
  GripVertical,
  Send,
  Settings2,
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

  const todayItems = itemsByDate.get(today) || []
  const todayGoals = goalsOn(plan, today)
  const todayChecked = new Set(plan.goalChecks[today] || [])
  const currentMonth = month || monthKey(plan.startDate)
  const canGoBack = currentMonth > monthKey(plan.startDate)
  const canGoForward = currentMonth < monthKey(plan.endDate)

  const renderCard = (item: PlanItem, { compact = false, inCalendar = false } = {}) => {
    const topic = topicsById.get(item.topicId)!
    const done = completedIds.has(item.topicId)
    const missed = isMissed(item)
    const dimmed = inCalendar && showMissed && !missed
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", item.id)
          e.dataTransfer.effectAllowed = "move"
        }}
        className={`group flex items-start gap-1.5 rounded-lg border px-2 py-1.5 cursor-grab active:cursor-grabbing transition ${
          done
            ? "bg-emerald-950/30 border-emerald-800/50"
            : missed
            ? "bg-red-950/40 border-red-800/60"
            : item.kind === "COMPULSORY"
            ? COMPULSORY_COLOR.planCard
            : trackColor(topicTrack(topic.roles, plan.tracks) || "ALL").planCard
        } ${dimmed ? "opacity-30" : ""}`}
        title={`${topic.title} · ${item.kind === "COMPULSORY" ? "Compulsory" : "Career track"}${missed ? " · Missed" : ""}`}
      >
        <button
          onClick={() => onSetTopicCompleted(item.topicId, !done)}
          className="mt-px shrink-0"
          title={done ? "Mark as not done" : "Mark as done"}
        >
          {done ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Circle className={`w-3.5 h-3.5 ${missed ? "text-red-400" : "text-zinc-500 hover:text-zinc-200"}`} />
          )}
        </button>
        <button
          onClick={() => onOpenNotes(topic)}
          className={`text-left text-[11px] leading-snug font-medium ${compact ? "line-clamp-2" : ""} ${
            done ? "text-zinc-400 line-through" : "text-zinc-100 hover:text-white"
          }`}
        >
          {topic.title}
        </button>
        <GripVertical className="w-3 h-3 text-zinc-600 shrink-0 ml-auto mt-px opacity-0 group-hover:opacity-100" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header + today's focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#121316] p-6 rounded-2xl border border-zinc-800/80 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium tracking-wide text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
                Learning Planner
              </span>
              <h1 className="text-2xl font-bold text-white mt-2 tracking-tight flex items-center gap-2">
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
          <div className="flex flex-wrap items-center gap-3 mt-5 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500/70" /> Compulsory</span>
            {plan.tracks.map((t) => (
              <span key={t} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded ${TRACK_COLORS[t].dot}`} /> {t}</span>
            ))}
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500/70" /> Personal goal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/70" /> Done</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/70" /> Missed</span>
            <span className="text-zinc-500">· Drag a card onto another day to reschedule it</span>
          </div>
        </div>

        <div className="bg-[#121316] p-5 rounded-2xl border border-zinc-800/80 shadow-xl space-y-3">
          <p className="text-xs font-semibold text-zinc-200">Today · {today}</p>
          {todayItems.length === 0 && todayGoals.length === 0 ? (
            <p className="text-xs text-zinc-500">Nothing planned for today.</p>
          ) : (
            <div className="space-y-1.5">
              {todayItems.map((item) => renderCard(item))}
              {todayGoals.map((goal) => {
                const done = todayChecked.has(goal.id)
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id, today, !done)}
                    className={`w-full flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[11px] font-medium transition ${
                      done ? "bg-emerald-950/30 border-emerald-800/50 text-zinc-400 line-through" : "bg-amber-950/30 border-amber-800/50 text-zinc-100"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Target className="w-3.5 h-3.5 text-amber-400" />}
                    {goal.title}
                  </button>
                )
              })}
            </div>
          )}
          <div className="pt-3 border-t border-zinc-800/80 space-y-2">
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
      </div>

      {/* Calendar */}
      <div className="bg-[#121316] rounded-2xl border border-zinc-800/80 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => canGoBack && setMonth(shiftMonth(currentMonth, -1))}
              disabled={!canGoBack}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold text-white w-36 text-center">{monthLabel(currentMonth)}</h2>
            <button
              onClick={() => canGoForward && setMonth(shiftMonth(currentMonth, 1))}
              disabled={!canGoForward}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowMissed((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
              showMissed ? "bg-red-950/60 text-red-200 border-red-700/60" : "bg-zinc-900 text-zinc-300 border-zinc-700/60 hover:border-zinc-500"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Missed ({missedItems.length})
          </button>
        </div>

        {showMissed && (
          <div className="px-5 py-4 border-b border-zinc-800/80 bg-red-950/10">
            {missedItems.length === 0 ? (
              <p className="text-xs text-zinc-400">No missed topics. Nice work!</p>
            ) : (
              <>
                <p className="text-xs text-zinc-400 mb-2.5">
                  Drag a missed topic onto an upcoming day to reschedule it, or tick it off if you already covered it.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">
                  {missedItems.map((item) => (
                    <div key={item.id}>
                      {renderCard(item)}
                      <p className="text-[10px] text-red-300/70 mt-0.5 pl-1">was due {item.date}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[860px] grid grid-cols-7">
            {WEEK_HEADER.map((d) => (
              <div key={d} className="px-2 py-2 text-[11px] font-semibold text-zinc-500 text-center border-b border-zinc-800/80">
                {d}
              </div>
            ))}
            {monthGrid(currentMonth).map((date) => {
              const inMonth = monthKey(date) === currentMonth
              const inPlan = date >= plan.startDate && date <= plan.endDate
              const items = itemsByDate.get(date) || []
              const goals = goalsOn(plan, date)
              const checked = new Set(plan.goalChecks[date] || [])
              const isToday = date === today
              return (
                <div
                  key={date}
                  data-date={date}
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
                  className={`min-h-[118px] p-1.5 border-b border-r border-zinc-800/60 space-y-1 transition ${
                    inMonth ? "" : "opacity-40"
                  } ${inPlan ? "bg-[#0e0f12]" : "bg-transparent"} ${
                    dragOverDate === date ? "bg-blue-950/40 ring-1 ring-inset ring-blue-500/60" : ""
                  } ${isToday ? "ring-1 ring-inset ring-white/40" : ""}`}
                >
                  <div className="flex items-center justify-between px-0.5">
                    <span
                      className={`text-[11px] font-semibold ${
                        isToday ? "bg-white text-black rounded px-1.5" : "text-zinc-500"
                      }`}
                    >
                      {Number(date.slice(8))}
                    </span>
                    {isToday && <span className="text-[9px] font-bold uppercase tracking-wide text-white">Today</span>}
                  </div>
                  {items.map((item) => renderCard(item, { compact: true, inCalendar: true }))}
                  {goals.map((goal) => {
                    const done = checked.has(goal.id)
                    const canTick = date <= today
                    return (
                      <button
                        key={goal.id}
                        onClick={() => canTick && toggleGoal(goal.id, date, !done)}
                        disabled={!canTick}
                        className={`w-full flex items-center gap-1 rounded-md px-1.5 py-0.5 text-left text-[10px] transition disabled:cursor-default ${
                          done
                            ? "text-emerald-300/80 line-through"
                            : showMissed
                            ? "text-amber-200/30"
                            : "text-amber-200/90 hover:bg-amber-950/40"
                        }`}
                        title={canTick ? (done ? "Mark as not done" : "Mark as done") : "Personal goal"}
                      >
                        {done ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <Target className="w-3 h-3 shrink-0" />}
                        <span className="truncate">{goal.title}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
        <FileText className="w-3 h-3" /> Click a topic title to open its notes.
      </p>
    </div>
  )
}
