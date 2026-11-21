'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useLogout, useSession } from '@/features/identity/hooks';
import { ROLE_LABEL } from '@/lib/auth/roles';
import { Button, ButtonLink } from '../ui/button';
import { Skeleton } from '../ui/feedback';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export function UserMenu() {
  const { data: user, isPending } = useSession();
  const logout = useLogout();

  if (isPending) return <Skeleton className="h-9 w-32" />;
  if (!user) return <ButtonLink href="/login" size="sm">Log in</ButtonLink>;

  return (
    <div className="flex items-center gap-1">
      <Link href="/account" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100" title="Your account">
        <span className="grid size-8 place-items-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
          {initials(user.fullName)}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block max-w-40 truncate text-sm font-medium text-slate-900">{user.fullName}</span>
          <span className="block text-xs text-slate-500">{ROLE_LABEL[user.role]}</span>
        </span>
      </Link>
      <Button variant="ghost" size="sm" onClick={() => logout.mutate()} loading={logout.isPending} aria-label="Log out" title="Log out">
        {!logout.isPending && <LogOut className="size-4" aria-hidden />}
      </Button>
    </div>
  );
}
