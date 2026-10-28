"use client"

import { useCallback, useEffect, useState } from "react"
import type { GameSummary } from "@/lib/gamification"
import { onReward } from "@/lib/reward-events"

/** Header chip: streak, XP and today's goal progress. */
export default function GameChip({ onClick }: { onClick?: () => void }) {
  const [summary, setSummary] = useState<GameSummary | null>(null)

  const load = useCallback(() => {
    fetch("/api/game")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSummary(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Record the learner's timezone once so streak days match their calendar
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    fetch("/api/game", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ timezone }) })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setSummary(data) : load()))
      .catch(load)
    return onReward(load)
  }, [load])

  if (!summary) return null
  const goalPct = Math.min(100, Math.round((summary.todayXp / summary.dailyGoal) * 100))

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${summary.streak}-day streak · Level ${summary.level.level} ${summary.level.title} · ${summary.todayXp}/${summary.dailyGoal} XP today`}
      aria-label={`${summary.streak} day streak, ${summary.xp} XP, level ${summary.level.level}. Open learning path`}
      className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl border bg-[#121316] border-zinc-800/80 hover:border-zinc-700 transition"
    >
      <span className={`flex items-center gap-1 text-xs font-bold ${summary.activeToday ? "text-orange-400" : "text-zinc-500"}`}>
        <span aria-hidden="true">🔥</span>
        {summary.streak}
      </span>
      <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
        <span aria-hidden="true">⚡</span>
        {summary.xp}
      </span>
      <span className="w-12 h-1.5 rounded-full bg-zinc-800 overflow-hidden" aria-hidden="true">
        <span className="block h-full bg-emerald-500 transition-all" style={{ width: `${goalPct}%` }} />
      </span>
    </button>
  )
}
