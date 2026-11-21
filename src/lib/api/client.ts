import 'client-only';
import { ApiError, type ErrorEnvelope } from './errors';

/**
 * The browser's only way to the backend. Every call goes to this app's own
 * /api/v1/* route (app/api/v1/[...path]/route.ts), which adds the token from the
 * httpOnly cookie and forwards it to NestJS. The paths are the ones in Swagger.
 */

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue>;

/** page / limit lists (identity, fleet, pricing, trips): meta is { page, limit, total }. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Page<T> {
  items: T[];
  meta: PageMeta;
}

interface SuccessEnvelope {
  success: true;
  message: string;
  data: unknown;
  meta: Record<string, unknown>;
}

function withQuery(path: string, query?: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  const search = params.toString();
  return `/api/v1${path}${search ? `?${search}` : ''}`;
}

/** An expired or missing token: back to the login page, then back here. */
function sendToLogin(): void {
  if (window.location.pathname === '/login') return;
  const next = window.location.pathname + window.location.search;
  window.location.assign(`/login?reason=expired&next=${encodeURIComponent(next)}`);
}

async function request(
  method: string,
  path: string,
  options: { query?: Query; body?: unknown } = {},
): Promise<SuccessEnvelope | null> {
  let response: Response;
  try {
    response = await fetch(withQuery(path, options.query), {
      method,
      cache: 'no-store',
      headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Check your connection.');
  }

  if (response.status === 204) return null;
  const json = (await response.json().catch(() => null)) as SuccessEnvelope | ErrorEnvelope | null;

  if (!response.ok || !json || json.success !== true) {
    const failure = json && json.success === false ? json : null;
    if (response.status === 401) sendToLogin();
    throw new ApiError(
      response.status,
      failure?.error.code ?? `HTTP_${response.status}`,
      failure?.error.message ?? `The request failed (${response.status})`,
      failure?.error.details ?? null,
      failure?.meta.requestId,
    );
  }
  return json;
}

export const api = {
  async get<T>(path: string, query?: Query): Promise<T> {
    return (await request('GET', path, { query }))?.data as T;
  },
  /** For the page / limit lists: { items, meta: { page, limit, total } }. */
  async page<T>(path: string, query?: Query): Promise<Page<T>> {
    const json = await request('GET', path, { query });
    return { items: (json?.data ?? []) as T[], meta: json?.meta as unknown as PageMeta };
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    return (await request('POST', path, { body }))?.data as T;
  },
  async put<T>(path: string, body?: unknown): Promise<T> {
    return (await request('PUT', path, { body }))?.data as T;
  },
  async patch<T>(path: string, body?: unknown): Promise<T> {
    return (await request('PATCH', path, { body }))?.data as T;
  },
  async delete<T = void>(path: string): Promise<T> {
    return (await request('DELETE', path))?.data as T;
  },
};
