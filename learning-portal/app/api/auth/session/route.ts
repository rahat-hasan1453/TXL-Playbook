import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession, setSessionCookies, SESSION_COOKIE_NAMES, UserRole } from '@/lib/auth'
import { memoryStore } from '@/lib/prisma'
import { resolveUserBlocksRole } from '@/lib/blocks-auth'

export async function GET() {
  const session = await getServerSession()
  const cookieStore = await cookies()
  if (!session.user) {
    // Missing, tampered or expired session: clear leftovers so the login page can't bounce back
    for (const name of SESSION_COOKIE_NAMES) cookieStore.delete(name)
    return NextResponse.json({ user: null })
  }

  const email = session.user.email.toLowerCase()
  const currentRole = session.user.role

  // Check if user has been assigned an updated role in memoryStore
  const storeRole =
    memoryStore.userRoles.get(session.user.id) ||
    memoryStore.userRoles.get(email)

  // Live synchronization with Blocks IAM role assignment
  const blocksRole = await resolveUserBlocksRole(email)

  // Direct synchronization: Blocks IAM role takes highest authority
  const resolvedRole: UserRole = blocksRole || storeRole || currentRole

  // If role has changed or discipline is outdated for Unit Head/Learner, update cookies dynamically
  const needsDisciplineUpdate =
    (resolvedRole === 'UNIT_HEAD' &&
      (!session.user.discipline ||
        session.user.discipline === 'Active Track' ||
        session.user.discipline === 'Product Track')) ||
    (resolvedRole === 'LEARNER' && session.user.discipline === 'Leadership & Strategy')

  if (resolvedRole !== currentRole || needsDisciplineUpdate) {
    let updatedDiscipline = session.user.discipline
    if (resolvedRole === 'UNIT_HEAD') {
      updatedDiscipline = 'Leadership & Strategy'
    } else {
      updatedDiscipline = 'Cloud Systems Engineer'
    }
    setSessionCookies(cookieStore, { ...session.user, role: resolvedRole, discipline: updatedDiscipline })

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
    const caller = await getServerSession()
    if (!caller.user || caller.user.role !== 'UNIT_HEAD') {
      return NextResponse.json({ error: 'Only Unit Heads can assign roles' }, { status: 403 })
    }
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
