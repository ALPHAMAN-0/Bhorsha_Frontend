import { isRole, type Role } from './roles';

/** What the backend signs into the access token (identity/auth.service.ts, JwtPayload) plus exp. */
export interface TokenClaims {
  sub: number;
  role: Role;
  exp: number;
}

/**
 * Reads the token's claims without checking the signature. Only the backend can
 * check it (it holds JWT_ACCESS_SECRET), and it does on every request. The
 * frontend uses the claims only to route pages and to time the cookie.
 */
export function readClaims(token: string): TokenClaims | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json: unknown = JSON.parse(atob(padded));
    if (typeof json !== 'object' || json === null) return null;
    const { sub, role, exp } = json as Record<string, unknown>;
    if (typeof sub !== 'number' || !isRole(role) || typeof exp !== 'number') return null;
    return { sub, role, exp };
  } catch {
    return null;
  }
}

/** Whole seconds until the token expires; 0 once it has. */
export function secondsLeft(claims: TokenClaims, now = Date.now()): number {
  return Math.max(0, Math.floor(claims.exp - now / 1000));
}
