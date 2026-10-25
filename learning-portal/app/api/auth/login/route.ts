import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole, verifyPassword, hashPassword } from '@/lib/auth'
import { memoryStore } from '@/lib/prisma'
import { blocksClient } from '@/lib/blocks'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body.email || '').trim().toLowerCase()
    const password = (body.password || '').trim()

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Determine target role centrally
    const isUnitHead =
      body.role === 'UNIT_HEAD' ||
      body.role === 'EDUCATOR' ||
      email.includes('lead') ||
      email.includes('head') ||
      email.includes('educator') ||
      email.includes('admin')

    const defaultRole: UserRole = isUnitHead ? 'UNIT_HEAD' : 'LEARNER'

    // Step 1: Check registered account in local memoryStore
    const existingUser = memoryStore.users.get(email)

    if (existingUser) {
      // Validate password strictly
      const isMatch = verifyPassword(password, existingUser.passwordHash)
      if (!isMatch) {
        return NextResponse.json(
          { error: 'Incorrect password. Please try again.' },
          { status: 401 }
        )
      }

      // Password matches! Issue authenticated session
      const role = existingUser.role || defaultRole
      const id = existingUser.id
      const name = existingUser.name
      const discipline = existingUser.discipline
      const avatar = existingUser.avatar

      const cookieStore = await cookies()
      const cookieOptions = {
        path: '/',
        httpOnly: false,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7,
      }

      cookieStore.set('txl_user_role', role, cookieOptions)
      cookieStore.set('txl_user_id', id, cookieOptions)
      cookieStore.set('txl_user_name', name, cookieOptions)
      cookieStore.set('txl_user_email', email, cookieOptions)
      cookieStore.set('txl_user_discipline', discipline, cookieOptions)
      cookieStore.set('txl_user_avatar', avatar, cookieOptions)

      return NextResponse.json({
        success: true,
        user: {
          id,
          name,
          email,
          role,
          discipline,
          avatar,
        },
      })
    }

    // Step 2: If not in local store, authenticate against SELISE Blocks IAM
    let blocksAuthUser: Record<string, unknown> | null = null
    try {
      const blocksAuth = await blocksClient.auth.login({
        username: email,
        password: password,
      })
      if (blocksAuth && !(blocksAuth as { error?: string }).error) {
        blocksAuthUser = blocksAuth as Record<string, unknown>
      }
    } catch {
      blocksAuthUser = null
    }

    if (!blocksAuthUser) {
      // Neither local store nor Blocks IAM verified this password!
      return NextResponse.json(
        { error: 'Invalid email or password. Please verify your credentials or register.' },
        { status: 401 }
      )
    }

    // Authenticated through Blocks IAM!
    const role: UserRole = defaultRole
    const derivedName = email
      ? email
          .split('@')[0]
          .split('.')
          .map((s: string) => (s ? s[0].toUpperCase() + s.slice(1) : ''))
          .join(' ')
      : (isUnitHead ? 'Unit Head' : 'Learner')
    const name = body.name || derivedName
    const id = (blocksAuthUser?.id as string) || `user-${Date.now()}`
    const discipline =
      body.discipline || (isUnitHead ? 'Leadership & Strategy' : 'Product Track')
    const avatar =
      body.avatar ||
      name
        .split(' ')
        .map((s: string) => s[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ||
      (isUnitHead ? 'UH' : 'LN')

    // Cache verified credentials for subsequent logins
    memoryStore.users.set(email, {
      id,
      email,
      passwordHash: hashPassword(password),
      name,
      role,
      discipline,
      avatar,
    })

    const cookieStore = await cookies()
    const cookieOptions = {
      path: '/',
      httpOnly: false,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    }

    cookieStore.set('txl_user_role', role, cookieOptions)
    cookieStore.set('txl_user_id', id, cookieOptions)
    cookieStore.set('txl_user_name', name, cookieOptions)
    cookieStore.set('txl_user_email', email, cookieOptions)
    cookieStore.set('txl_user_discipline', discipline, cookieOptions)
    cookieStore.set('txl_user_avatar', avatar, cookieOptions)

    return NextResponse.json({
      success: true,
      user: {
        id,
        name,
        email,
        role,
        discipline,
        avatar,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    )
  }
}
