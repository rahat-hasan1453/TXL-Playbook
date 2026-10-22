import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PRESET_USERS, UserRole } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const role: UserRole = body.role === 'UNIT_HEAD' ? 'UNIT_HEAD' : 'LEARNER'

    const preset = PRESET_USERS[role]
    const id = body.id || preset.id
    const name = body.name || preset.name
    const email = body.email || preset.email
    const discipline = body.discipline || preset.discipline
    const avatar = body.avatar || preset.avatar

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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    )
  }
}
