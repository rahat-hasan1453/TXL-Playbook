import { runDueReminders } from "@/lib/reminders"

const globalState = globalThis as typeof globalThis & { __txlReminderTimer?: NodeJS.Timeout }

if (process.env.REMINDER_SCHEDULER !== "off" && !globalState.__txlReminderTimer) {
  const tick = () => {
    runDueReminders().catch((err) => console.warn("Reminder scheduler tick failed:", err))
  }
  globalState.__txlReminderTimer = setInterval(tick, 60_000)
  tick()
}
