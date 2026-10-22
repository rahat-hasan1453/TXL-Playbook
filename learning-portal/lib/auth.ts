import { cookies } from 'next/headers'

export type UserRole = 'LEARNER' | 'UNIT_HEAD'

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole
  discipline: string
  avatar: string
}

export const PRESET_USERS: Record<UserRole, UserSession> = {
  LEARNER: {
    id: 'user-1',
    name: 'Rahat Chowdhury',
    email: 'rahat@selise.ch',
    role: 'LEARNER',
    discipline: 'AI Product Manager',
    avatar: 'RC',
  },
  UNIT_HEAD: {
    id: 'user-head',
    name: 'Sarah Jenkins',
    email: 'sarah.lead@selise.ch',
    role: 'UNIT_HEAD',
    discipline: 'Unit Head / Pod Lead',
    avatar: 'SJ',
  },
}

export async function getServerSession(): Promise<{ user: UserSession | null }> {
  const cookieStore = await cookies()
  const role = cookieStore.get('txl_user_role')?.value as UserRole | undefined
  if (!role) {
    return { user: null }
  }

  const userId = cookieStore.get('txl_user_id')?.value || (role === 'UNIT_HEAD' ? 'user-head' : 'user-1')
  const userName = cookieStore.get('txl_user_name')?.value || (role === 'UNIT_HEAD' ? 'Sarah Jenkins' : 'Rahat Chowdhury')
  const email = cookieStore.get('txl_user_email')?.value || (role === 'UNIT_HEAD' ? 'sarah.lead@selise.ch' : 'rahat@selise.ch')
  const discipline = cookieStore.get('txl_user_discipline')?.value || (role === 'UNIT_HEAD' ? 'Unit Head / Pod Lead' : 'AI Product Manager')
  const avatar = cookieStore.get('txl_user_avatar')?.value || (role === 'UNIT_HEAD' ? 'SJ' : 'RC')

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
