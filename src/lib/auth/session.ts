import 'server-only';
import { cookies } from 'next/headers';
import { type SessionUser, TOKEN_COOKIE, USER_COOKIE } from './cookies';
import { isRole } from './roles';
import { readClaims, secondsLeft } from './token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

/** The access token, or null when there is none or it has expired. */
export async function getToken(): Promise<string | null> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  const claims = readClaims(token);
  return claims && secondsLeft(claims) > 0 ? token : null;
}

/** The logged-in user. The id and role come from the token, never from the display cookie. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;
  if (!claims || secondsLeft(claims) === 0) return null;

  let profile: Partial<SessionUser> = {};
  try {
    profile = JSON.parse(store.get(USER_COOKIE)?.value ?? '{}') as Partial<SessionUser>;
  } catch {
    // A broken display cookie only costs the name in the header.
  }
  return {
    id: claims.sub,
    role: claims.role,
    fullName: typeof profile.fullName === 'string' ? profile.fullName : `User ${claims.sub}`,
    phone: typeof profile.phone === 'string' ? profile.phone : '',
    email: typeof profile.email === 'string' ? profile.email : null,
  };
}

/** Keeps only the fields the frontend needs from the backend's PublicUser. */
export function toSessionUser(user: Record<string, unknown>): SessionUser | null {
  const { id, fullName, phone, email, role } = user;
  if (typeof id !== 'number' || typeof fullName !== 'string' || !isRole(role)) return null;
  return {
    id,
    fullName,
    phone: typeof phone === 'string' ? phone : '',
    email: typeof email === 'string' ? email : null,
    role,
  };
}

/** Stores the token and the profile for exactly as long as the token is valid. */
export async function startSession(token: string, user: SessionUser): Promise<void> {
  const claims = readClaims(token);
  if (!claims) throw new Error('The API returned a token this app cannot read');
  const maxAge = secondsLeft(claims);
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, { ...COOKIE_OPTIONS, maxAge });
  store.set(USER_COOKIE, JSON.stringify(user), { ...COOKIE_OPTIONS, maxAge });
}

/** Replaces the display profile (after the user edits it), keeping the token's lifetime. */
export async function refreshSessionUser(user: SessionUser): Promise<void> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;
  if (!claims || claims.sub !== user.id) return;
  store.set(USER_COOKIE, JSON.stringify(user), { ...COOKIE_OPTIONS, maxAge: secondsLeft(claims) });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}
