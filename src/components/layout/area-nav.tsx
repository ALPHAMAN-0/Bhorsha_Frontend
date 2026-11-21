'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/features/identity/hooks';
import { cn } from '@/lib/cn';
import { activeHref, type Area, NAV } from './nav-config';

type Layout = 'row' | 'column';

/** The links of one area. Without `pathname` (the Suspense fallback) nothing is highlighted. */
export function NavLinks({ area, layout, pathname }: { area: Area; layout: Layout; pathname?: string }) {
  const { data: user } = useSession();
  const items = NAV[area].filter((item) => !item.adminOnly || user?.role === 'ADMIN');
  const current = pathname ? activeHref(items, pathname) : undefined;

  return (
    <nav aria-label="Main">
      <ul className={cn('flex gap-1', layout === 'column' ? 'flex-col' : 'overflow-x-auto')}>
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={href === current ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                href === current ? 'bg-teal-50 text-teal-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Highlights the current page. usePathname suspends on [id] pages, so this sits in a Suspense boundary. */
export function AreaNav({ area, layout }: { area: Area; layout: Layout }) {
  const pathname = usePathname();
  return <NavLinks area={area} layout={layout} pathname={pathname} />;
}
