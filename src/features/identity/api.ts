import { api } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';
import type {
  CreateStaffInput,
  DriverFilters,
  DriverReview,
  LoginInput,
  RegisteredUser,
  RegisterInput,
  SessionUser,
  UpdateUserInput,
  User,
  UserFilters,
  VerifyDriverInput,
} from './types';

// ---- This app's session (app/api/session/route.ts) ----

export async function fetchSession(): Promise<SessionUser | null> {
  const response = await fetch('/api/session', { cache: 'no-store' });
  const json = (await response.json().catch(() => null)) as { user?: SessionUser | null } | null;
  return json?.user ?? null;
}

export async function login(input: LoginInput): Promise<{ user: SessionUser; home: string }> {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      json?.error?.code ?? 'LOGIN_FAILED',
      json?.error?.message ?? 'Login failed',
      json?.error?.details ?? null,
      json?.meta?.requestId,
    );
  }
  return json;
}

export async function logout(): Promise<void> {
  await fetch('/api/session', { method: 'DELETE' });
}

// ---- Backend: auth, users and driver verification ----

export const register = (input: RegisterInput) => api.post<RegisteredUser>('/auth/register', input);

export const listUsers = (filters: UserFilters) => api.page<User>('/users', filters);
export const getUser = (id: number) => api.get<User>(`/users/${id}`);
export const createStaff = (input: CreateStaffInput) => api.post<User>('/users', input);
export const updateUser = (id: number, input: UpdateUserInput) => api.patch<User>(`/users/${id}`, input);
/** Deactivates; users are never deleted. Answers 204. */
export const deactivateUser = (id: number) => api.delete(`/users/${id}`);

export const listDrivers = (filters: DriverFilters) => api.page<DriverReview>('/drivers', filters);
export const verifyDriver = (id: number, input: VerifyDriverInput) =>
  api.patch<DriverReview>(`/drivers/${id}/verify`, input);
