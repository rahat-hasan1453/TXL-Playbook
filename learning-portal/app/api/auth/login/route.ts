import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body.email || '').trim().toLowerCase()

    // Determine role centrally (managed in Blocks IAM)
    // If explicit role is sent from token/IAM claims or email indicates Unit Head/Lead/Educator:
    const isUnitHead =
      body.role === 'UNIT_HEAD' ||
      body.role === 'EDUCATOR' ||
      email.includes('lead') ||
      email.includes('head') ||
      email.includes('educator') ||
      email.includes('admin')

    const role: UserRole = isUnitHead ? 'UNIT_HEAD' : 'LEARNER'

    const id = body.id || `user-${Date.now()}`
    const derivedName = email
      ? email
          .split('@')[0]
          .split('.')
          .map((s: string) => (s ? s[0].toUpperCase() + s.slice(1) : ''))
          .join(' ')
      : (isUnitHead ? 'Unit Head' : 'Learner')
    const name = body.name || derivedName
    const finalEmail = body.email || email
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

    const cookieStore = await cookies()
    const cookieOptions = {
      path: '/',
      httpOnly: false,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }

    cookieStore.set('txl_user_role', role, cookieOptions)
    cookieStore.set('txl_user_id', id, cookieOptions)
    cookieStore.set('txl_user_name', name, cookieOptions)
    cookieStore.set('txl_user_email', finalEmail, cookieOptions)
    cookieStore.set('txl_user_discipline', discipline, cookieOptions)
    cookieStore.set('txl_user_avatar', avatar, cookieOptions)

    return NextResponse.json({
      success: true,
      user: {
        id,
        name,
        email: finalEmail,
        role,
        discipline,
        avatar,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    )
  }
}
