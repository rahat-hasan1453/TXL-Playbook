import { cookies } from 'next/headers'
import crypto from 'crypto'

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
  const role = cookieStore.get('txl_user_role')?.value as UserRole | undefined
  if (!role) {
    return { user: null }
  }

  const email = cookieStore.get('txl_user_email')?.value || ''
  const defaultName = email
    ? email
        .split('@')[0]
        .split('.')
        .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ''))
        .join(' ')
    : (role === 'UNIT_HEAD' ? 'Unit Head' : 'Learner')
  const userName = cookieStore.get('txl_user_name')?.value || defaultName
  const userId = cookieStore.get('txl_user_id')?.value || `user-${role.toLowerCase()}`
  const discipline =
    cookieStore.get('txl_user_discipline')?.value ||
    (role === 'UNIT_HEAD' ? 'Unit Leadership' : 'Active Track')
  const avatar =
    cookieStore.get('txl_user_avatar')?.value ||
    (userName
      ? userName
          .split(' ')
          .map((s) => s[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : (role === 'UNIT_HEAD' ? 'UH' : 'LN'))

  return {
    user: {
      id: userId,
      name: userName,
      email,
      role,
      discipline,
      avatar,
    },
  }
}
