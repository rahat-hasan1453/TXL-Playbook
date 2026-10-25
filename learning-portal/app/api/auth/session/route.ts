import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession, UserRole } from '@/lib/auth'
import { memoryStore } from '@/lib/prisma'

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

  // Also check if email pattern indicates leadership role
  const isEmailLead =
    email.includes('lead') ||
    email.includes('head') ||
    email.includes('educator') ||
    email.includes('admin')

  const resolvedRole: UserRole = storeRole || (isEmailLead ? 'UNIT_HEAD' : currentRole)

  // If role has changed, update cookies dynamically on the fly
  if (resolvedRole !== currentRole) {
    const cookieOptions = {
      path: '/',
      httpOnly: false,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    }

    cookieStore.set('txl_user_role', resolvedRole, cookieOptions)

    let updatedDiscipline = session.user.discipline
    if (resolvedRole === 'UNIT_HEAD' && (!updatedDiscipline || updatedDiscipline === 'Active Track' || updatedDiscipline === 'Product Track')) {
      updatedDiscipline = 'Leadership & Strategy'
      cookieStore.set('txl_user_discipline', updatedDiscipline, cookieOptions)
    }

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
