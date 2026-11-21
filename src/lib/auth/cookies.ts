import type { Role } from './roles';

/** The backend's access token. httpOnly, so no page script can ever read it. */
export const TOKEN_COOKIE = 'bhorsha_token';

/** The logged-in user's public profile, for the header. Display only: the token decides access. */
export const USER_COOKIE = 'bhorsha_user';

/** The part of the backend's PublicUser that the frontend keeps in its session. */
export interface SessionUser {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  role: Role;
}
