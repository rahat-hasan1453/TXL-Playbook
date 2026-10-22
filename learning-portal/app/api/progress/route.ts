import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'
import {notFound, redirect} from 'next/navigation'
import {getServerSession} from '@/lib/auth'
import {z} from 'zod'

// validates request payload for marking a topic as done
const updateProgressSchema = z.object({
  topicId: z.string(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
})

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({error: 'Not authenticated'}, {status: 401})
  }

  const data = await req.json()
  const parsed = updateProgressSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400})
  }

  const {topicId, status} = parsed.data

  // ensure topic exists
  const topic = await prisma.topic.findUnique({where: {id: topicId}})
  if (!topic) {
    return NextResponse.json({error: 'Topic not found'}, {status: 404})
  }

  const upsert = await prisma.userProgress.upsert({
    where: {userId_topicId: {userId: session.user.id, topicId}},
    update: {status, completedAt: status === 'COMPLETED' ? new Date() : null},
    create: {userId: session.user.id, topicId, status, completedAt: status === 'COMPLETED' ? new Date() : null}
  })

  return NextResponse.json(upsert, {status: 200})
}
