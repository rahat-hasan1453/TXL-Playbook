"use client"

import { useMemo, useState } from "react"
import { Briefcase, Code, Cpu, Layers, Plus, Trash2, X, CalendarDays, Bell, Target } from "lucide-react"
import type { Domain } from "@/lib/curriculumData"
import { trackColor } from "@/lib/track-colors"
import {
  CustomGoal,
  GoalFrequency,
  LearningPlan,
  MAX_TRACKS,
  PLAN_TRACKS,
  PlanSettings,
  PlanTrack,
  WEEKDAY_LABELS,
  compulsoryTopics,
  daysBetween,
  planEndDate,
  trackTopics,
} from "@/lib/learning-plan"

const TRACK_META: Record<PlanTrack, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  Consultant: { label: "Product Consultant", icon: Briefcase },
  "Service Designer": { label: "Service Designer", icon: Layers },
  "AI PM": { label: "AI Product Manager", icon: Cpu },
  Engineer: { label: "Engineer", icon: Code },
}

function localToday(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

interface PlanWizardProps {
  domains: Domain[]
  completedTopicIds: Set<string>
  existingPlan: LearningPlan | null
  onSubmit: (settings: PlanSettings) => Promise<void>
  onDelete?: () => Promise<void>
  onClose?: () => void
}

export default function PlanWizard({ domains, completedTopicIds, existingPlan, onSubmit, onDelete, onClose }: PlanWizardProps) {
  const [startDate, setStartDate] = useState(existingPlan?.startDate || localToday())
  const [durationMonths, setDurationMonths] = useState<1 | 2>(existingPlan?.durationMonths || 1)
  const [tracks, setTracks] = useState<PlanTrack[]>(existingPlan?.tracks || [])
  const [goals, setGoals] = useState<CustomGoal[]>(existingPlan?.customGoals || [])
  const [reminderTime, setReminderTime] = useState(existingPlan?.reminderTime || "09:00")
  const [goalTitle, setGoalTitle] = useState("")
  const [goalFrequency, setGoalFrequency] = useState<GoalFrequency>("DAILY")
  const [goalDays, setGoalDays] = useState<number[]>([0, 3])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const preview = useMemo(() => {
    const days = daysBetween(startDate, planEndDate(startDate, durationMonths)).length
    const compulsory = compulsoryTopics(domains).filter((t) => !completedTopicIds.has(t.id))
    const compulsoryIds = new Set(compulsory.map((t) => t.id))
    const track = trackTopics(domains, tracks).filter((t) => !completedTopicIds.has(t.id) && !compulsoryIds.has(t.id))
    return { days, compulsory: compulsory.length, track: track.length }
  }, [domains, completedTopicIds, startDate, durationMonths, tracks])

  const toggleTrack = (track: PlanTrack) => {
    setTracks((prev) => {
      if (prev.includes(track)) return prev.filter((t) => t !== track)
      if (prev.length >= MAX_TRACKS) return [prev[1], track]
      return [...prev, track]
    })
  }

  const toggleGoalDay = (day: number) => {
    setGoalDays((prev) => {
      if (prev.includes(day)) return prev.filter((d) => d !== day)
      if (prev.length >= 2) return [prev[1], day]
      return [...prev, day]
    })
  }

  const addGoal = () => {
    const title = goalTitle.trim()
    if (!title) return
    if (goalFrequency === "TWICE_WEEKLY" && goalDays.length !== 2) {
      setError("Pick two weekdays for a twice-a-week goal")
      return
    }
    setGoals((prev) => [
      ...prev,
      {
        id: `goal-${Date.now().toString(36)}`,
        title,
        frequency: goalFrequency,
        days: goalFrequency === "DAILY" ? [] : [...goalDays].sort(),
      },
    ])
    setGoalTitle("")
    setError(null)
  }

  const submit = async () => {
    if (!tracks.length) {
      setError("Choose at least one career track")
      return
    }
    if (existingPlan && !window.confirm("Rebuild your schedule? Topics you moved by hand will be placed again automatically.")) {
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        startDate,
        durationMonths,
        tracks,
        customGoals: goals,
        reminderTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save plan")
    } finally {
      setSaving(false)
    }
  }

  const sectionTitle = "text-xs font-semibold text-zinc-200 flex items-center gap-2"
  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
      active ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-300 border-zinc-700/60 hover:border-zinc-500"
    }`

  return (
    <div className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium tracking-wide text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
            Learning Planner
          </span>
          <h2 className="text-xl font-bold text-white mt-2 tracking-tight">
            {existingPlan ? "Edit your learning plan" : "Plan your next 1–2 months"}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Compulsory topics are always included. Pick up to two career tracks and any personal goals, and we will lay
            out a day-by-day schedule.
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <p className={sectionTitle}>
            <CalendarDays className="w-3.5 h-3.5 text-blue-400" /> Duration
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {([1, 2] as const).map((m) => (
              <button key={m} onClick={() => setDurationMonths(m)} className={chip(durationMonths === m)}>
                {m} month{m === 2 ? "s" : ""}
              </button>
            ))}
            <label className="flex items-center gap-2 text-xs text-zinc-400 ml-1">
              from
              <input
                type="date"
                value={startDate}
                onChange={(e) => e.target.value && setStartDate(e.target.value)}
                className="bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
              />
            </label>
          </div>
        </div>

        <div className="space-y-2.5">
          <p className={sectionTitle}>
            <Bell className="w-3.5 h-3.5 text-blue-400" /> Daily email reminder
          </p>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            Send at
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => e.target.value && setReminderTime(e.target.value)}
              className="bg-[#0a0a0c] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
            every day to your login email
          </label>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className={sectionTitle}>Career tracks (choose up to {MAX_TRACKS})</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PLAN_TRACKS.map((track) => {
            const { label, icon: Icon } = TRACK_META[track]
            const active = tracks.includes(track)
            return (
              <button
                key={track}
                onClick={() => toggleTrack(track)}
                aria-pressed={active}
                className={`p-3.5 rounded-xl border text-left transition ${
                  active ? `${trackColor(track).card} bg-[#16181f]` : "border-zinc-800 bg-[#0a0a0c] hover:border-zinc-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${trackColor(track).text}`} />
                <span className={`block text-xs font-semibold mt-2 ${active ? "text-white" : "text-zinc-300"}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className={sectionTitle}>
          <Target className="w-3.5 h-3.5 text-amber-400" /> Personal goals (optional)
        </p>
        <p className="text-xs text-zinc-500">
          Skills outside the curriculum, like client communication or English speaking. They repeat on the days you
          choose and show up in your reminder.
        </p>
        {goals.length > 0 && (
          <ul className="space-y-1.5">
            {goals.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#0a0a0c] border border-zinc-800 text-xs"
              >
                <span className="text-zinc-200 font-medium">{g.title}</span>
                <span className="flex items-center gap-3 text-zinc-500">
                  {g.frequency === "DAILY" ? "Every day" : `Twice a week · ${g.days.map((d) => WEEKDAY_LABELS[d]).join(" & ")}`}
                  <button
                    onClick={() => setGoals((prev) => prev.filter((x) => x.id !== g.id))}
                    className="text-zinc-500 hover:text-red-400 transition"
                    title="Remove goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            placeholder="e.g. Practise English speaking"
            maxLength={120}
            className="flex-1 min-w-[200px] bg-[#0a0a0c] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
          />
          <button onClick={() => setGoalFrequency("DAILY")} className={chip(goalFrequency === "DAILY")}>
            Every day
          </button>
          <button onClick={() => setGoalFrequency("TWICE_WEEKLY")} className={chip(goalFrequency === "TWICE_WEEKLY")}>
            Twice a week
          </button>
          <button
            onClick={addGoal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        {goalFrequency === "TWICE_WEEKLY" && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 mr-1">On:</span>
            {WEEKDAY_LABELS.map((label, day) => (
              <button
                key={label}
                onClick={() => toggleGoalDay(day)}
                className={`w-11 py-1 rounded-md text-[11px] font-medium border transition ${
                  goalDays.includes(day)
                    ? "bg-amber-500/20 text-amber-200 border-amber-500/50"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
        <p className="text-xs text-zinc-400">
          <span className="text-white font-semibold">{preview.compulsory}</span> compulsory +{" "}
          <span className="text-white font-semibold">{preview.track}</span> track topics over{" "}
          <span className="text-white font-semibold">{preview.days}</span> days
          {goals.length > 0 && (
            <>
              {" "}
              + <span className="text-white font-semibold">{goals.length}</span> personal goal{goals.length === 1 ? "" : "s"}
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {existingPlan && onDelete && (
            <button
              onClick={() => window.confirm("Delete your learning plan? Your topic progress is kept.") && onDelete()}
              className="px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 transition"
            >
              Delete plan
            </button>
          )}
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow transition disabled:opacity-50"
          >
            {saving ? "Building schedule…" : existingPlan ? "Rebuild schedule" : "Generate my schedule"}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400 -mt-3">{error}</p>}
    </div>
  )
}
