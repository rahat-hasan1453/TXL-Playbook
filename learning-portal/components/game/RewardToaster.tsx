"use client"

import { useEffect, useState } from "react"
import type { Reward } from "@/lib/gamification"
import { onReward } from "@/lib/reward-events"

interface Toast {
  id: number
  reward: Reward
}

/** Small celebration in the corner whenever XP is earned. */
export default function RewardToaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(
    () =>
      onReward((reward) => {
        const id = Date.now() + Math.random()
        setToasts((prev) => [...prev.slice(-2), { id, reward }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200)
      }),
    []
  )

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 items-end pointer-events-none" aria-live="polite">
      {toasts.map(({ id, reward }) => (
        <div
          key={id}
          role="status"
          className="reward-pop pointer-events-auto min-w-[220px] max-w-xs bg-[#18191d] border border-amber-700/60 rounded-2xl px-4 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">⚡</span>
            <div>
              <p className="text-sm font-extrabold text-amber-300">+{reward.xpGained} XP</p>
              <p className="text-[11px] text-zinc-400">
                🔥 {reward.streak}-day streak · {reward.totalXp} XP total
              </p>
            </div>
          </div>
          {reward.dailyGoalReached && (
            <p className="mt-2 text-xs font-semibold text-emerald-300">🎯 Daily goal reached!</p>
          )}
          {reward.levelUp && (
            <p className="mt-2 text-xs font-semibold text-violet-300">
              ⬆️ Level {reward.levelUp.level}: {reward.levelUp.title}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
