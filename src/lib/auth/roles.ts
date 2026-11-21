/** The four roles of the backend (identity module, enum Role). */
export const ROLES = ['RIDER', 'DRIVER', 'ADMIN', 'SUPPORT'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  RIDER: 'Rider',
  DRIVER: 'Driver',
  SUPPORT: 'Support Officer',
  ADMIN: 'Admin',
};

/** Where each role lands after logging in. Admins and Support Officers share the ops console. */
export const HOME_BY_ROLE: Record<Role, string> = {
  RIDER: '/rider',
  DRIVER: '/driver',
  SUPPORT: '/ops',
  ADMIN: '/ops',
};

/** Ops pages that only an Admin may open; the API answers 403 to a Support Officer there. */
const ADMIN_ONLY = ['/ops/users', '/ops/drivers', '/ops/fare-rules'];

const AREAS: ReadonlyArray<{ prefix: string; roles: readonly Role[] }> = [
  { prefix: '/rider', roles: ['RIDER'] },
  { prefix: '/driver', roles: ['DRIVER'] },
  { prefix: '/ops', roles: ['ADMIN', 'SUPPORT'] },
  { prefix: '/account', roles: ROLES },
];

function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

/**
 * Whether a role may open a page. This only decides what the UI shows: the
 * backend checks the role again on every request.
 */
export function canVisit(role: Role, pathname: string): boolean {
  if (ADMIN_ONLY.some((prefix) => isUnder(pathname, prefix))) {
    return role === 'ADMIN';
  }
  const area = AREAS.find((a) => isUnder(pathname, a.prefix));
  return area ? area.roles.includes(role) : true;
}
