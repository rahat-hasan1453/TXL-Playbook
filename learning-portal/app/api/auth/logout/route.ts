import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const cookieKeys = [
    'txl_user_role',
    'txl_user_id',
    'txl_user_name',
    'txl_user_email',
    'txl_user_discipline',
    'txl_user_avatar',
  ]

  for (const key of cookieKeys) {
    cookieStore.delete(key)
  }

  return NextResponse.json({ success: true })
}
