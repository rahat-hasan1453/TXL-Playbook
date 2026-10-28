import { todayIn } from "@/lib/learning-plan"
import { getPlan } from "@/lib/plan-store"
import { buildDayDigest } from "@/lib/reminders"
import { verifyReminderToken } from "@/lib/reminder-token"
import ReminderChecklist from "./ReminderChecklist"

export const dynamic = "force-dynamic"

export default async function ReminderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ all?: string }>
}) {
  const { token } = await params
  const { all } = await searchParams
  const claims = verifyReminderToken(token, todayIn("UTC"))
  const plan = claims ? getPlan(claims.email) : null

  if (!claims || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#121316] border border-zinc-800 rounded-2xl p-8 text-center">
          <h1 className="text-lg font-bold text-white">This reminder link has expired</h1>
          <p className="text-sm text-zinc-400 mt-2">Open the portal to see and update your learning plan.</p>
          <a
            href="/"
            className="inline-block mt-5 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200"
          >
            Open TXL Playbook
          </a>
        </div>
      </div>
    )
  }

  return <ReminderChecklist token={token} initialDigest={buildDayDigest(plan, claims.date)} highlightAll={all === "1"} />
}
