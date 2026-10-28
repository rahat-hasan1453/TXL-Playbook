import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { getWeeklyLeaderboard } from "@/lib/game-store"

// Visible to every signed-in user. Entries carry names, levels, weekly XP and streaks only;
// which topics anyone studied stays private.
export async function GET() {
  const { user } = await getServerSession()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ entries: await getWeeklyLeaderboard(user.email) })
}
