import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { getSharedFeed, addSharedLearning, likeSharedLearning } from "@/lib/feed-store"
import { awardXp } from "@/lib/game-store"

export async function GET() {
  const feed = await getSharedFeed()
  return NextResponse.json({ feed })
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await req.json()
  const { topicTitle, domainName, note } = body

  if (!note || !note.trim()) {
    return NextResponse.json({ error: "Note content is required" }, { status: 400 })
  }

  const item = await addSharedLearning({
    userName: session.user.name,
    userRole: session.user.discipline,
    topicTitle: topicTitle || "Curriculum Competency",
    domainName: domainName || "General",
    note: note.trim(),
  })

  const reward =
    session.user.role === "LEARNER"
      ? await awardXp(session.user.email, "share", item.id, { name: session.user.name, avatar: session.user.avatar })
      : null

  return NextResponse.json({ success: true, item, reward })
}

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
  }

  const updated = await likeSharedLearning(id)
  if (!updated) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, item: updated })
}
