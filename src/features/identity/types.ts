/**
 * Mirrors the backend's identity module (bhorsha/src/modules/identity):
 * register, login, users and driver verification.
 */
import type { Availability, Verification } from '@/features/fleet/types';
import type { Role } from '@/lib/auth/roles';

export type { SessionUser } from '@/lib/auth/cookies';
export type { Role };

/** PublicUser (identity/user-response.ts). The password hash is never sent. */
export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  suspendedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The phone format every identity DTO checks (identity/dto/user-fields.ts). */
export const PHONE_PATTERN = /^\+8801[3-9]\d{8}$/;

export type RegisterInput = {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  role: 'RIDER' | 'DRIVER';
  licenceNo?: string;
};

export interface RegisteredUser extends User {
  driverProfile: { licenceNo: string; verification: Verification; status: Availability } | null;
}

export type LoginInput = { phone: string; password: string };

export type CreateStaffInput = {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  role: 'ADMIN' | 'SUPPORT';
};

/** PATCH /users/{id}. The owner may change name and email; role, isActive and suspendedUntil are Admin only. */
export type UpdateUserInput = {
  fullName?: string;
  email?: string | null;
  role?: Role;
  isActive?: boolean;
  suspendedUntil?: string | null;
};

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type UserFilters = { page: number; limit: number; role?: Role; status?: UserStatus };

/** A driver under review (GET /drivers, PATCH /drivers/{id}/verify). */
export interface DriverReview {
  userId: number;
  licenceNo: string;
  verification: Verification;
  status: Availability;
  rejectionReason: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export type DriverFilters = { page: number; limit: number; verification?: Verification };

export type VerifyDriverInput = { verification: 'VERIFIED' | 'REJECTED'; rejectionReason?: string };

/** The status a user is in, the way GET /users filters it. */
export function userStatus(user: Pick<User, 'isActive' | 'suspendedUntil'>, now = Date.now()): UserStatus {
  if (!user.isActive) return 'DEACTIVATED';
  if (user.suspendedUntil && new Date(user.suspendedUntil).getTime() > now) return 'SUSPENDED';
  return 'ACTIVE';
}
