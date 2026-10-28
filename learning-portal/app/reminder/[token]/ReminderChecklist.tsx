"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Sparkles, Target } from "lucide-react"
import type { DayDigest } from "@/lib/reminders"

export default function ReminderChecklist({
  token,
  initialDigest,
  highlightAll,
}: {
  token: string
  initialDigest: DayDigest
  highlightAll: boolean
}) {
  const [digest, setDigest] = useState(initialDigest)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = digest.topics.length + digest.goals.length
  const doneCount = digest.topics.filter((t) => t.completed).length + digest.goals.filter((g) => g.done).length
  const allDone = total > 0 && doneCount === total

  const act = async (body: Record<string, unknown>) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/reminders/act", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Could not save")
      setDigest(data.digest)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save")
    } finally {
      setBusy(false)
    }
  }

  const dateLabel = new Date(`${digest.date}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div className="max-w-lg w-full bg-[#121316] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div>
          <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/50">
            Daily learning check-in
          </span>
          <h1 className="text-xl font-bold text-white mt-3 tracking-tight">{dateLabel}</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {total === 0 ? "Nothing was planned for this day." : "Did you study these today? Tick off what you finished."}
          </p>
        </div>

        {total > 0 && (
          <button
            onClick={() => act({ action: "all" })}
            disabled={busy || allDone}
            className={`w-full py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 disabled:cursor-default ${
              allDone
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                : highlightAll
                ? "bg-emerald-500 hover:bg-emerald-400 text-black ring-2 ring-emerald-300/50"
                : "bg-white hover:bg-zinc-200 text-black"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {allDone ? "All done for today" : "Yes, I studied everything"}
          </button>
        )}

        <ul className="space-y-2">
          {digest.topics.map(({ topic, item, completed }) => (
            <li key={item.id}>
              <button
                onClick={() => act({ action: "topic", topicId: topic.id, done: !completed })}
                disabled={busy}
                className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  completed ? "border-emerald-700/50 bg-emerald-950/20" : "border-zinc-800 bg-[#0a0a0c] hover:border-zinc-700"
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                )}
                <span>
                  <span className={`block text-sm font-semibold ${completed ? "text-zinc-400 line-through" : "text-white"}`}>
                    {topic.title}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    {item.kind === "COMPULSORY" ? "Compulsory" : "Career track"}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {digest.goals.map(({ goal, done }) => (
            <li key={goal.id}>
              <button
                onClick={() => act({ action: "goal", goalId: goal.id, done: !done })}
                disabled={busy}
                className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  done ? "border-emerald-700/50 bg-emerald-950/20" : "border-zinc-800 bg-[#0a0a0c] hover:border-zinc-700"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                )}
                <span>
                  <span className={`block text-sm font-semibold ${done ? "text-zinc-400 line-through" : "text-white"}`}>
                    {goal.title}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-amber-400/80 mt-0.5">
                    <Target className="w-3 h-3" />
                    Personal goal
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {digest.missedCount > 0 && (
          <p className="text-xs text-red-300/90 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            You have {digest.missedCount} missed topic{digest.missedCount === 1 ? "" : "s"} from earlier days. Open your
            plan to reschedule them.
          </p>
        )}

        <a href="/" className="block text-center text-xs text-zinc-400 hover:text-white transition">
          Open my learning plan →
        </a>
      </div>
    </div>
  )
}
