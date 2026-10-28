import { cookies } from 'next/headers'
import crypto from 'crypto'
import { getSecret } from '@/lib/app-secret'

export type UserRole = 'LEARNER' | 'UNIT_HEAD'

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole
  discipline: string
  avatar: string
}

export function hashPassword(password: string): string {
  const salt = 'txl-playbook-2026-auth'
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function getServerSession(): Promise<{ user: UserSession | null }> {
  const cookieStore = await cookies()
  const get = (k: string) => cookieStore.get(`txl_user_${k}`)?.value || ''
  const role = get('role') as UserRole
  const sig = cookieStore.get('txl_sig')?.value
  if ((role !== 'LEARNER' && role !== 'UNIT_HEAD') || !sig) {
    return { user: null }
  }

  const user: UserSession = {
    id: get('id'),
    name: get('name'),
    email: get('email'),
    role,
    discipline: get('discipline'),
    avatar: get('avatar'),
  }
  const expected = Buffer.from(signSession(user))
  const given = Buffer.from(sig)
  if (!user.email || expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
    return { user: null }
  }
  return { user }
}

// ---------- signed session cookies ----------
// The readable txl_user_* cookies are kept for the UI, but they are only trusted when
// txl_sig (an HMAC over all of them) matches, so a role can't be forged in the browser.

const SESSION_KEYS = ['role', 'id', 'email', 'name', 'discipline', 'avatar'] as const
export const SESSION_COOKIE_NAMES = [...SESSION_KEYS.map((k) => `txl_user_${k}`), 'txl_sig']

function signSession(user: Record<(typeof SESSION_KEYS)[number], string>): string {
  const payload = JSON.stringify(SESSION_KEYS.map((k) => user[k]))
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

type CookieWriter = { set: (name: string, value: string, options?: Record<string, unknown>) => unknown }

export function setSessionCookies(cookieStore: CookieWriter, user: UserSession) {
  const options = {
    path: '/',
    httpOnly: false,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  }
  for (const key of SESSION_KEYS) cookieStore.set(`txl_user_${key}`, user[key], options)
  cookieStore.set('txl_sig', signSession(user), { ...options, httpOnly: true })
}
