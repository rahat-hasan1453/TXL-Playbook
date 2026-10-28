// Runs the daily reminder check once a minute inside the Node.js server process.
// Hosts without a long-running process should set REMINDER_SCHEDULER=off and call
// POST /api/reminders/run from an external cron instead.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node")
  }
}
