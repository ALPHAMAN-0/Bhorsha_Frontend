import type { NextRequest } from 'next/server';
import { HOME_BY_ROLE } from '@/lib/auth/roles';
import { endSession, getSessionUser, startSession, toSessionUser } from '@/lib/auth/session';
import { backendUrl } from '@/lib/env';

/**
 * The frontend's own session, kept in httpOnly cookies:
 *   GET    who is logged in ({ user: null } when nobody)
 *   POST   log in with { phone, password } through the backend's POST /auth/login
 *   DELETE log out (the backend keeps no session, so dropping the cookies is enough)
 */

function failure(status: number, code: string, message: string) {
  return Response.json({ success: false, error: { code, message, details: null }, meta: {} }, { status });
}

export async function GET() {
  return Response.json({ user: await getSessionUser() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return failure(400, 'BAD_REQUEST', 'Send phone and password as JSON');

  let upstream: Response;
  try {
    upstream = await fetch(`${backendUrl()}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      // Only the two login fields go through; the backend validates them.
      body: JSON.stringify({ phone: body.phone, password: body.password }),
      cache: 'no-store',
      redirect: 'error',
    });
  } catch {
    return failure(502, 'BACKEND_UNREACHABLE', 'The Bhorsha API is not reachable. Is the backend running?');
  }

  const json = (await upstream.json().catch(() => null)) as
    | { success: true; data: { accessToken: string; user: Record<string, unknown> } }
    | { success: false }
    | null;
  if (!upstream.ok || !json || json.success !== true) {
    return json ? Response.json(json, { status: upstream.status }) : failure(502, 'BAD_GATEWAY', 'Unexpected answer from the API');
  }

  const user = toSessionUser(json.data.user);
  if (!user) return failure(502, 'BAD_GATEWAY', 'The API returned an unknown user');
  await startSession(json.data.accessToken, user);
  return Response.json({ user, home: HOME_BY_ROLE[user.role] });
}

export async function DELETE() {
  await endSession();
  return new Response(null, { status: 204 });
}
