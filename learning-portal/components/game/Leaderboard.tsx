"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Flame, Trophy } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/gamification"
import { onReward } from "@/lib/reward-events"

const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
]

// Rank styles for the podium places, Duolingo-style coins
const PODIUM = [
  { ring: "border-amber-400", coin: "bg-amber-400 text-amber-950", bar: "bg-amber-400", height: "h-24", label: "1st" },
  { ring: "border-zinc-300", coin: "bg-zinc-300 text-zinc-800", bar: "bg-zinc-300", height: "h-16", label: "2nd" },
  { ring: "border-orange-400", coin: "bg-orange-400 text-orange-950", bar: "bg-orange-400", height: "h-12", label: "3rd" },
]

function avatarColor(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[h]
}

function daysUntilReset() {
  const day = new Date().getDay() // 0 Sunday … 6 Saturday; weeks restart on Monday
  return ((8 - day) % 7) || 7
}

function Avatar({ entry, size = "w-10 h-10" }: { entry: LeaderboardEntry; size?: string }) {
  return (
    <span
      className={`${size} rounded-full flex items-center justify-center text-xs font-extrabold text-white on-solid border-b-[3px] border-black/25 shrink-0 ${avatarColor(
        entry.name
      )}`}
    >
      {entry.avatar}
    </span>
  )
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

  const visible = useMemo(() => (entries ? (compact ? entries.slice(0, 10) : entries) : []), [entries, compact])
  const earners = visible.filter((e) => e.weekXp > 0)
  const podium = earners.slice(0, 3)
  const resetDays = daysUntilReset()
  // Show the podium only once at least three people have earned XP
  const showPodium = podium.length === 3
  const listStart = showPodium ? 3 : 0
  const me = entries?.find((e) => e.isYou)

  return (
    <section className="space-y-4" aria-label="Weekly leaderboard">
      {/* Header */}
      <div className="bg-[#121316] border border-zinc-800/80 border-b-4 rounded-2xl p-5 sm:p-6 flex flex-wrap items-center gap-4">
        <span className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center border-b-4 border-amber-600 shrink-0">
          <Trophy className="w-8 h-8" />
        </span>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Weekly leaderboard</h2>
          <p className="text-xs text-zinc-400 mt-0.5">XP earned since Monday. Everyone can climb, and topic details stay private.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/40 border border-amber-800/50 rounded-full px-3 py-1">
            Resets in {resetDays} day{resetDays === 1 ? "" : "s"}
          </span>
          {me && me.weekXp > 0 && (
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-full px-3 py-1">
              You&apos;re #{me.rank}
            </span>
          )}
        </div>
      </div>

      {entries === null ? (
        <p className="text-xs text-zinc-500 px-1">Loading…</p>
      ) : visible.length === 0 || earners.length === 0 ? (
        <div className="bg-[#121316] border border-zinc-800/80 border-b-4 rounded-2xl p-6">
          <div className="relative">
            <ul className="space-y-2 opacity-40" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0e0f12] border border-zinc-800/80">
                  <span className="w-6 h-3 rounded bg-zinc-800" />
                  <span className="w-10 h-10 rounded-full bg-zinc-800" />
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
        </div>
      ) : (
        <>
          {showPodium && (
            <div className="bg-[#121316] border border-zinc-800/80 border-b-4 rounded-2xl px-4 pt-6 pb-0 overflow-hidden">
              <div className="flex items-end justify-center gap-3 sm:gap-6">
                {[podium[1], podium[0], podium[2]].map((e) => {
                  const place = podium.indexOf(e)
                  const st = PODIUM[place]
                  return (
                    <div key={`${e.rank}-${e.name}`} className="flex flex-col items-center w-24 sm:w-32">
                      <span className={`relative rounded-full border-4 ${st.ring}`}>
                        <Avatar entry={e} size="w-14 h-14 sm:w-16 sm:h-16" />
                        <span
                          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center ${st.coin}`}
                        >
                          {place + 1}
                        </span>
                      </span>
                      <p className="mt-4 text-sm font-bold text-white truncate max-w-full">
                        {e.name}
                        {e.isYou && <span className="ml-1 text-[10px] font-extrabold text-emerald-300">YOU</span>}
                      </p>
                      <p className="text-xs font-extrabold text-amber-300 tabular-nums">{e.weekXp} XP</p>
                      <div className={`mt-2 w-full rounded-t-xl ${st.bar} ${st.height} flex items-start justify-center pt-2`}>
                        <span className="text-xs font-extrabold text-black/60">{st.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <ol className="space-y-2" start={listStart + 1}>
            {visible.slice(listStart).map((e) => (
              <li
                key={`${e.rank}-${e.name}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-b-4 ${
                  e.isYou
                    ? "bg-emerald-950/30 border-emerald-700/70"
                    : "bg-[#121316] border-zinc-800/80"
                } ${e.weekXp === 0 ? "opacity-70" : ""}`}
              >
                <span
                  className={`w-8 text-center text-base font-extrabold tabular-nums ${
                    e.weekXp > 0 ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {e.rank}
                </span>
                <Avatar entry={e} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-white truncate">
                    {e.name}
                    {e.isYou && <span className="ml-2 text-[10px] font-extrabold text-emerald-300">YOU</span>}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-zinc-500">
                    Lv {e.level} {e.levelTitle}
                    <span className={`flex items-center gap-0.5 ${e.streak > 0 ? "text-orange-400" : ""}`}>
                      <Flame className="w-3 h-3" /> {e.streak}
                    </span>
                  </span>
                </span>
                <span className="text-sm font-extrabold text-zinc-200 tabular-nums">{e.weekXp} XP</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
