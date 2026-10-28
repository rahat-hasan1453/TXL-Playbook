import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole, verifyPassword, hashPassword, setSessionCookies } from '@/lib/auth'
import { memoryStore } from '@/lib/prisma'
import { blocksClient } from '@/lib/blocks'
import {
  resolveUserBlocksRole,
  decodeJwtPayload,
  extractRoles,
  fetchRolesWithToken,
  isLeadershipRole,
} from '@/lib/blocks-auth'

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

    // Live sync check with SELISE Blocks IAM role assignment
    const blocksIamRole = await resolveUserBlocksRole(email)

    // Role comes only from Blocks IAM (or the email heuristic), never from the request body
    const isUnitHead = blocksIamRole === 'UNIT_HEAD' || isLeadershipRole([], email)

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

      // Password matches! Issue authenticated session with synchronized role
      const role: UserRole = blocksIamRole || existingUser.role || defaultRole

      const isHead = role === 'UNIT_HEAD'
      const id = existingUser.id
      const name = existingUser.name
      const discipline = isHead
        ? 'Leadership & Strategy'
        : (existingUser.discipline === 'Leadership & Strategy' ? 'Cloud Systems Engineer' : (existingUser.discipline || 'Cloud Systems Engineer'))
      const avatar = existingUser.avatar

      // Update user record in memoryStore with synced role
      existingUser.role = role
      existingUser.discipline = discipline
      memoryStore.userRoles.set(email, role)
      memoryStore.userRoles.set(id, role)

      setSessionCookies(await cookies(), { id, name, email, role, discipline, avatar })

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

    // Authenticated through Blocks IAM! Decode token claims for live roles
    const accessToken = (blocksAuthUser.access_token || blocksAuthUser.accessToken) as string | undefined
    const idToken = (blocksAuthUser.id_token || blocksAuthUser.idToken) as string | undefined
    const accessClaims = decodeJwtPayload(accessToken) || {}
    const idClaims = decodeJwtPayload(idToken) || {}

    const gatheredRoles: unknown[] = [
      blocksAuthUser.roles,
      blocksAuthUser.role,
      accessClaims.roles,
      accessClaims.role,
      (accessClaims.realm_access as Record<string, unknown>)?.roles,
      idClaims.roles,
      idClaims.role,
    ]

    const extractedRoles: string[] = []
    for (const r of gatheredRoles) {
      if (r) extractedRoles.push(...extractRoles(r))
    }

    extractedRoles.push(...(await fetchRolesWithToken(accessToken)))
    const tokenIsHead = isLeadershipRole(extractedRoles, email)
    const role: UserRole = (tokenIsHead || blocksIamRole === 'UNIT_HEAD' || isUnitHead) ? 'UNIT_HEAD' : 'LEARNER'

    const derivedName =
      (idClaims.name as string) ||
      (accessClaims.name as string) ||
      (email
        ? email
            .split('@')[0]
            .split('.')
            .map((s: string) => (s ? s[0].toUpperCase() + s.slice(1) : ''))
            .join(' ')
        : (role === 'UNIT_HEAD' ? 'Unit Head' : 'Learner'))

    const name = body.name || derivedName
    const id = (idClaims.sub as string) || (blocksAuthUser?.id as string) || `user-${Date.now()}`
    const discipline =
      role === 'UNIT_HEAD'
        ? 'Leadership & Strategy'
        : (body.discipline || 'Cloud Systems Engineer')

    const avatar =
      body.avatar ||
      name
        .split(' ')
        .map((s: string) => s[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ||
      (role === 'UNIT_HEAD' ? 'UH' : 'LN')

    // Cache verified credentials and resolved role for subsequent logins
    memoryStore.users.set(email, {
      id,
      email,
      passwordHash: hashPassword(password),
      name,
      role,
      discipline,
      avatar,
    })
    memoryStore.userRoles.set(email, role)
    memoryStore.userRoles.set(id, role)

    setSessionCookies(await cookies(), { id, name, email, role, discipline, avatar })

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
