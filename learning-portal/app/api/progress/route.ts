import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { z } from "zod"
import {
  getAllLearners,
  getLearnerProgress,
  getLearnerNotes,
  updateLearnerTopicProgress,
  saveLearnerTopicNote,
  getOrCreateLearner,
} from "@/lib/progress-store"
import { learnerProgressCollection } from "@/lib/blocks"
import { awardXp, mergeRewards } from "@/lib/game-store"
import { isNoteEmpty } from "@/lib/note-content"

const updateProgressSchema = z.object({
  topicId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  note: z.string().optional(),
})

export async function GET() {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const email = session.user.email.toLowerCase()
  const isUnitHead = session.user.role === "UNIT_HEAD"

  // Ensure current user is registered in learner store
  if (!isUnitHead) {
    await getOrCreateLearner(
      email,
      session.user.name,
      session.user.discipline,
      session.user.avatar,
      session.user.id
    )
  }

  if (isUnitHead) {
    // Unit Head gets the live cross-pod learners roster and progress
    const learners = await getAllLearners()
    return NextResponse.json({
      role: "UNIT_HEAD",
      learners,
    })
  }

  // Learner gets their own progress and notes
  const progress = await getLearnerProgress(email)
  const notes = await getLearnerNotes(email)

  return NextResponse.json({
    role: "LEARNER",
    progress,
    notes,
  })
}

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const data = await req.json()
  const parsed = updateProgressSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const { topicId, status, note } = parsed.data
  const email = session.user.email.toLowerCase()

  // Update server persistent progress store
  const updatedLearner = await updateLearnerTopicProgress(
    email,
    topicId,
    status,
    session.user.name,
    session.user.discipline,
    session.user.avatar,
    session.user.id
  )

  if (note !== undefined) {
    await saveLearnerTopicNote(email, topicId, note)
  }

  // Best effort sync with Blocks Data Gateway collection
  try {
    learnerProgressCollection.create({
      userId: session.user.id,
      userEmail: email,
      topicId,
      status: status === "NOT_STARTED" ? "PLANNED" : status,
      completedAt: status === "COMPLETED" ? new Date().toISOString() : undefined,
    }).catch(() => {})
  } catch {
    // Ignore Data Gateway offline error
  }

  // Learners earn XP; each topic and each topic's first note pays out once
  let reward = null
  if (session.user.role === "LEARNER") {
    const profile = { name: session.user.name, avatar: session.user.avatar }
    reward = mergeRewards([
      status === "COMPLETED" ? await awardXp(email, "topic", topicId, profile) : null,
      note !== undefined && !isNoteEmpty(note) ? await awardXp(email, "note", topicId, profile) : null,
    ])
  }

  return NextResponse.json({
    success: true,
    progress: updatedLearner.progress,
    notes: updatedLearner.notes,
    reward,
  })
}
