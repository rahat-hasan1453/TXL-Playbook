"use client"

import { useCallback, useEffect, useState } from "react"
import { Trophy } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/gamification"
import { onReward } from "@/lib/reward-events"

const MEDALS = ["🥇", "🥈", "🥉"]

function daysUntilReset() {
  const day = new Date().getDay() // 0 Sunday … 6 Saturday; weeks restart on Monday
  return ((8 - day) % 7) || 7
}

/** This week's XP ranking. Shows no topic-level detail, by design. */
export default function Leaderboard({ compact = false }: { compact?: boolean }) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null)

  const load = useCallback(() => {
    fetch("/api/leaderboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setEntries(data?.entries || []))
      .catch(() => setEntries([]))
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    const off = onReward(load)
    return () => {
      clearInterval(interval)
      off()
    }
  }, [load])

  return (
    <section className="bg-[#121316] border border-zinc-800/80 rounded-2xl p-5 sm:p-6" aria-label="Weekly leaderboard">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Weekly Leaderboard
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            XP earned since Monday. Anyone can climb. Topic details stay private.
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-bold text-amber-300 bg-amber-950/40 border border-amber-800/50 rounded-lg px-2.5 py-1">
          Resets in {daysUntilReset()} day{daysUntilReset() === 1 ? "" : "s"}
        </span>
      </div>

      {entries === null ? (
        <p className="text-xs text-zinc-500">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="relative">
          <ul className="space-y-2 opacity-40" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0e0f12] border border-zinc-800/80">
                <span className="w-7 h-3 rounded bg-zinc-800" />
                <span className="w-8 h-8 rounded-lg bg-zinc-800" />
                <span className="flex-1 h-3 rounded bg-zinc-800" />
                <span className="w-12 h-3 rounded bg-zinc-800" />
              </li>
            ))}
          </ul>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-white">No one is on the board yet this week</p>
            <p className="text-xs text-zinc-400 mt-1">Finish a topic to earn XP and take the first spot.</p>
          </div>
        </div>
      ) : (
        <ol className="space-y-1.5">
          {(compact ? entries.slice(0, 10) : entries).map((e) => (
            <li
              key={`${e.rank}-${e.name}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                e.isYou ? "bg-amber-950/30 border-amber-700/60" : "bg-[#0e0f12] border-zinc-800/80"
              }`}
            >
              <span className="w-7 text-center text-sm font-bold text-zinc-400">{e.weekXp > 0 ? MEDALS[e.rank - 1] || e.rank : e.rank}</span>
              <span className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-[11px] font-bold text-zinc-200">
                {e.avatar}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-zinc-100 truncate">
                  {e.name}
                  {e.isYou && <span className="ml-1.5 text-[10px] font-bold text-amber-300">YOU</span>}
                </span>
                <span className="block text-[11px] text-zinc-500">
                  Lv {e.level} {e.levelTitle} · 🔥 {e.streak}
                </span>
              </span>
              <span className="text-sm font-extrabold text-amber-300 tabular-nums">{e.weekXp} XP</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
