import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // A session needs both the role cookie and its server-issued signature (verified in getServerSession)
  const userRole = request.cookies.get('txl_sig')?.value ? request.cookies.get('txl_user_role')?.value : undefined

  // Public paths that do not require authentication
  const isPublicPath =
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    // Reminder email links authenticate with their own signed token
    pathname.startsWith('/reminder/') ||
    pathname === '/api/reminders/act' ||
    // Checks the cron secret or the session itself
    pathname === '/api/reminders/run' ||
    (pathname === '/api/feed' && request.method === 'GET') ||
    (pathname === '/api/curriculum' && request.method === 'GET')

  // If unauthenticated and accessing a protected route:
  // For API routes, return 401 JSON instead of redirecting
  // For page routes, redirect to /login
  if (!userRole && !isPublicPath) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If already authenticated and accessing /login, redirect to main portal
  if (userRole && pathname === '/login') {
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, etc.)
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
}
