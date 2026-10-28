import { runDueReminders } from "@/lib/reminders"

const globalState = globalThis as typeof globalThis & { __txlReminderTimer?: NodeJS.Timeout }

// Serverless hosts have no long-lived process; they use Vercel Cron (vercel.json) instead
if (process.env.REMINDER_SCHEDULER !== "off" && !process.env.VERCEL && !globalState.__txlReminderTimer) {
  const tick = () => {
    runDueReminders().catch((err) => console.warn("Reminder scheduler tick failed:", err))
  }
  globalState.__txlReminderTimer = setInterval(tick, 60_000)
  tick()
}
