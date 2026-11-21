import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE, USER_COOKIE } from '@/lib/auth/cookies';
import { refreshSessionUser, toSessionUser } from '@/lib/auth/session';
import { readClaims, secondsLeft } from '@/lib/auth/token';
import { backendUrl } from '@/lib/env';

/**
 * Backend-for-frontend gateway: /api/v1/<path> here = /api/v1/<path> on NestJS.
 *
 * The browser calls this app on its own origin, so the backend needs no CORS.
 * This handler adds the access token from the httpOnly cookie, so page scripts
 * never hold it. The upstream origin is fixed (BACKEND_URL); only the path and
 * query come from the request, so the token cannot be sent anywhere else.
 */

/** Logging in goes through /api/session, which keeps the token out of the browser. */
const BLOCKED = new Set(['auth/login']);

function failure(status: number, code: string, message: string) {
  return Response.json({ success: false, error: { code, message, details: null }, meta: {} }, { status });
}

async function forward(request: NextRequest, ctx: RouteContext<'/api/v1/[...path]'>) {
  const { path } = await ctx.params;
  if (path.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return failure(400, 'BAD_REQUEST', 'Invalid path');
  }
  const joined = path.map(encodeURIComponent).join('/');
  if (BLOCKED.has(joined)) return failure(404, 'NOT_FOUND', 'Log in through /api/session');

  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;

  const headers = new Headers({ accept: 'application/json' });
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  if (token && claims && secondsLeft(claims) > 0) headers.set('authorization', `Bearer ${token}`);

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  let upstream: Response;
  try {
    upstream = await fetch(`${backendUrl()}/api/v1/${joined}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
      redirect: 'error',
    });
  } catch {
    return failure(502, 'BACKEND_UNREACHABLE', 'The Bhorsha API is not reachable. Is the backend running?');
  }

  // A rejected token is gone for good (there is no refresh token): drop the cookies.
  if (upstream.status === 401 && token) {
    store.delete(TOKEN_COOKIE);
    store.delete(USER_COOKIE);
  }

  // Editing your own profile also updates the name in the header.
  if (request.method === 'PATCH' && claims && joined === `users/${claims.sub}` && upstream.ok) {
    const json = (await upstream.clone().json().catch(() => null)) as { data?: Record<string, unknown> } | null;
    const user = json?.data ? toSessionUser(json.data) : null;
    if (user) await refreshSessionUser(user);
  }

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get('content-type');
  if (upstreamType) responseHeaders.set('content-type', upstreamType);
  return new Response(upstream.status === 204 ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
