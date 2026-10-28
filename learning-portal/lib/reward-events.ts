import type { Reward } from "@/lib/gamification"

// Client-side bus: anything that earns XP announces it, the header chip and toaster react.
const EVENT = "txl:reward"

export function announceReward(reward: Reward | null | undefined) {
  if (typeof window === "undefined" || !reward) return
  window.dispatchEvent(new CustomEvent<Reward>(EVENT, { detail: reward }))
}

export function onReward(handler: (reward: Reward) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<Reward>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
