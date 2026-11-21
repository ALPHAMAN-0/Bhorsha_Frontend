import 'server-only';

/**
 * Where the NestJS backend runs. Only the Next.js server calls it, through
 * app/api/session and app/api/v1/[...path], so the browser never needs CORS or
 * sees the token.
 */
export function backendUrl(): string {
  return (process.env.BACKEND_URL ?? 'http://localhost:3002').replace(/\/+$/, '');
}
