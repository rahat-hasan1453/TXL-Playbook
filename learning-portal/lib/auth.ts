import { cookies } from 'next/headers'

// Session resolver for user roles & identity (Learner vs Unit Head)
export async function getServerSession() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('txl_user_role')?.value || 'LEARNER'
  const userId = cookieStore.get('txl_user_id')?.value || 'user-learner-1'
  const userName = cookieStore.get('txl_user_name')?.value || (userRole === 'UNIT_HEAD' ? 'Sarah (Unit Head)' : 'Alex (Learner)')

  return {
    user: {
      id: userId,
      name: userName,
      email: `${userId}@txl.selise.ch`,
      role: userRole as 'LEARNER' | 'UNIT_HEAD'
    }
  }
}
