import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession, UserRole } from '@/lib/auth'
import { memoryStore } from '@/lib/prisma'
import { resolveUserBlocksRole } from '@/lib/blocks-auth'

export async function GET() {
  const session = await getServerSession()
  if (!session.user) {
    return NextResponse.json({ user: null })
  }

  const cookieStore = await cookies()
  const email = session.user.email.toLowerCase()
  const currentRole = session.user.role

  // Check if user has been assigned an updated role in memoryStore
  const storeRole =
    memoryStore.userRoles.get(session.user.id) ||
    memoryStore.userRoles.get(email)

  // Live synchronization with Blocks IAM role assignment
  const blocksRole = await resolveUserBlocksRole(email)

  // Also check if email pattern indicates leadership role
  const isEmailLead =
    email.includes('lead') ||
    email.includes('head') ||
    email.includes('educator') ||
    email.includes('admin')

  const resolvedRole: UserRole =
    blocksRole === 'UNIT_HEAD' || storeRole === 'UNIT_HEAD' || isEmailLead
      ? 'UNIT_HEAD'
      : (storeRole || currentRole)

  // If role has changed or discipline is outdated for Unit Head, update cookies dynamically
  const needsDisciplineUpdate =
    resolvedRole === 'UNIT_HEAD' &&
    (!session.user.discipline ||
      session.user.discipline === 'Active Track' ||
      session.user.discipline === 'Product Track')

  if (resolvedRole !== currentRole || needsDisciplineUpdate) {
    const cookieOptions = {
      path: '/',
      httpOnly: false,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    }

    cookieStore.set('txl_user_role', resolvedRole, cookieOptions)

    let updatedDiscipline = session.user.discipline
    if (resolvedRole === 'UNIT_HEAD') {
      updatedDiscipline = 'Leadership & Strategy'
      cookieStore.set('txl_user_discipline', updatedDiscipline, cookieOptions)
    }

    // Update in-memory user record
    const existing = memoryStore.users.get(email)
    if (existing) {
      existing.role = resolvedRole
      existing.discipline = updatedDiscipline
    }
    memoryStore.userRoles.set(email, resolvedRole)
    memoryStore.userRoles.set(session.user.id, resolvedRole)

    const updatedUser = {
      ...session.user,
      role: resolvedRole,
      discipline: updatedDiscipline,
    }

    return NextResponse.json({
      user: updatedUser,
      roleUpdated: true,
      previousRole: currentRole,
      newRole: resolvedRole,
    })
  }

  return NextResponse.json(session)
}

// Allows an administrator or IAM event to promote/assign a role dynamically
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { email, userId, role } = body

    if (!role || (role !== 'UNIT_HEAD' && role !== 'LEARNER' && role !== 'EDUCATOR')) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 })
    }

    const assignedRole: UserRole = (role === 'UNIT_HEAD' || role === 'EDUCATOR') ? 'UNIT_HEAD' : 'LEARNER'

    if (email) {
      memoryStore.userRoles.set(email.toLowerCase(), assignedRole)
    }
    if (userId) {
      memoryStore.userRoles.set(userId, assignedRole)
    }

    // Check if the current session caller is the promoted user
    const session = await getServerSession()
    if (
      session.user &&
      ((email && session.user.email.toLowerCase() === email.toLowerCase()) ||
        (userId && session.user.id === userId))
    ) {
      const cookieStore = await cookies()
      const cookieOptions = {
        path: '/',
        httpOnly: false,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7,
      }
      cookieStore.set('txl_user_role', assignedRole, cookieOptions)
      if (assignedRole === 'UNIT_HEAD') {
        cookieStore.set('txl_user_discipline', 'Leadership & Strategy', cookieOptions)
      }
    }

    return NextResponse.json({
      success: true,
      assignedRole,
      target: email || userId,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update role' },
      { status: 500 }
    )
  }
}
