import Link from 'next/link';
import { type ReactNode, Suspense } from 'react';
import { AreaNav, NavLinks } from './area-nav';
import { Logo } from './logo';
import type { Area } from './nav-config';
import { UserMenu } from './user-menu';

/**
 * The frame of every signed-in page. The rider, driver and account areas put
 * their few links in the header; the ops console has more, so it gets a sidebar.
 */
export function AppShell({ area, actions, children }: { area: Area; actions?: ReactNode; children: ReactNode }) {
  const sidebar = area === 'ops';

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/" className="shrink-0" aria-label="Bhorsha home">
            <Logo />
          </Link>
          {!sidebar && (
            <div className="hidden min-w-0 flex-1 md:block">
              <Suspense fallback={<NavLinks area={area} layout="row" />}>
                <AreaNav area={area} layout="row" />
              </Suspense>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <UserMenu />
          </div>
        </div>
        <div className={sidebar ? 'border-t border-slate-100 px-2 py-1 lg:hidden' : 'border-t border-slate-100 px-2 py-1 md:hidden'}>
          <Suspense fallback={<NavLinks area={area} layout="row" />}>
            <AreaNav area={area} layout="row" />
          </Suspense>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-6 sm:py-8">
        {sidebar && (
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-24">
              <Suspense fallback={<NavLinks area={area} layout="column" />}>
                <AreaNav area={area} layout="column" />
              </Suspense>
            </div>
          </aside>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
