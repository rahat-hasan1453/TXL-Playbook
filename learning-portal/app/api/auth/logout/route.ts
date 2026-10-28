import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAMES } from '@/lib/auth'

export async function POST() {
  const cookieStore = await cookies()
  const cookieKeys = SESSION_COOKIE_NAMES

  for (const key of cookieKeys) {
    cookieStore.delete(key)
  }

  return NextResponse.json({ success: true })
}
