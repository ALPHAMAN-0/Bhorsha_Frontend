import {
  ArrowLeft,
  Banknote,
  BadgeCheck,
  Car,
  CarFront,
  CarTaxiFront,
  FileText,
  Flag,
  Gavel,
  History,
  LayoutDashboard,
  type LucideIcon,
  Route,
  Scale,
  UserRound,
  Users,
} from 'lucide-react';

/** The four parts of the app: the rider app, the driver app, the ops console and the account pages. */
export type Area = 'rider' | 'driver' | 'ops' | 'account';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shown to Admins only; Support Officers get 403 from these endpoints. */
  adminOnly?: boolean;
}

export const NAV: Record<Area, NavItem[]> = {
  rider: [
    { href: '/rider', label: 'Book a ride', icon: CarTaxiFront },
    { href: '/rider/share', label: 'Share a ride', icon: Users },
    { href: '/rider/rides', label: 'My rides', icon: History },
  ],
  driver: [
    { href: '/driver', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/driver/rides', label: 'My rides', icon: History },
    { href: '/driver/offers', label: 'Route offers', icon: Route },
    { href: '/driver/vehicles', label: 'Vehicles', icon: Car },
  ],
  ops: [
    { href: '/ops', label: 'Overview', icon: LayoutDashboard },
    { href: '/ops/cases', label: 'Cases', icon: FileText },
    { href: '/ops/strikes', label: 'Strikes', icon: Gavel },
    { href: '/ops/appeals', label: 'Appeals', icon: Scale },
    { href: '/ops/rides', label: 'Rides', icon: CarFront },
    { href: '/ops/audit-logs', label: 'Audit log', icon: History },
    { href: '/ops/users', label: 'Users', icon: Users, adminOnly: true },
    { href: '/ops/drivers', label: 'Driver checks', icon: BadgeCheck, adminOnly: true },
    { href: '/ops/fare-rules', label: 'Fare rules', icon: Banknote, adminOnly: true },
  ],
  account: [
    { href: '/', label: 'Back to the app', icon: ArrowLeft },
    { href: '/account', label: 'Profile', icon: UserRound },
    { href: '/account/cases', label: 'Report a problem', icon: Flag },
    { href: '/account/strikes', label: 'Strikes & appeals', icon: Scale },
  ],
};

/** The item for a path: the longest href that is the path or a parent of it. */
export function activeHref(items: NavItem[], pathname: string): string | undefined {
  return items
    .filter((item) => item.href !== '/' && (pathname === item.href || pathname.startsWith(`${item.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
