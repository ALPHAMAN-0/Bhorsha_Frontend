import { type NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE, USER_COOKIE } from '@/lib/auth/cookies';
import { canVisit, HOME_BY_ROLE } from '@/lib/auth/roles';
import { readClaims, secondsLeft } from '@/lib/auth/token';

/**
 * Runs before every page in the matcher. An optimistic check from the cookie
 * alone: who is logged in and which area their role may open. The backend still
 * authorizes every API call, so this only keeps people on the right pages.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;
  const session = claims && secondsLeft(claims) > 0 ? claims : null;

  // The landing, login and register pages are for visitors; members go home.
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return session
      ? NextResponse.redirect(new URL(HOME_BY_ROLE[session.role], request.url))
      : NextResponse.next();
  }

  if (!session) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', pathname + search);
    if (token) login.searchParams.set('reason', 'expired');
    const response = NextResponse.redirect(login);
    if (token) {
      response.cookies.delete(TOKEN_COOKIE);
      response.cookies.delete(USER_COOKIE);
    }
    return response;
  }

  if (!canVisit(session.role, pathname)) {
    return NextResponse.redirect(new URL(HOME_BY_ROLE[session.role], request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/rider/:path*', '/driver/:path*', '/ops/:path*', '/account/:path*'],
};
