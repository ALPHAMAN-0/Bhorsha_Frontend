import { Inbox, LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Spinner({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-sm text-slate-500', className)}>
      <LoaderCircle className="size-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/70', className)} />;
}

/** A page-sized loading placeholder, for loading.tsx files and Suspense fallbacks. */
export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-500">{icon ?? <Inbox className="size-5" aria-hidden />}</div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
