import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { humanize } from '@/lib/format';

export type Tone = 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'teal';

const TONES: Record<Tone, string> = {
  gray: 'bg-slate-100 text-slate-700 ring-slate-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  teal: 'bg-teal-50 text-teal-800 ring-teal-200',
};

export function Badge({ tone = 'gray', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** One colour per backend status word, so the same status looks the same everywhere. */
const STATUS_TONE: Record<string, Tone> = {
  // rides and seats
  REQUESTED: 'amber',
  OFFERING: 'amber',
  ACCEPTED: 'green',
  ARRIVED: 'blue',
  IN_PROGRESS: 'violet',
  AWAITING_HANDOVER: 'amber',
  COMPLETED: 'green',
  CANCELLED: 'gray',
  CONFIRMED: 'blue',
  PICKED_UP: 'violet',
  DROPPED: 'green',
  NO_SHOW: 'red',
  // sharing
  PENDING: 'amber',
  DECLINED: 'gray',
  EXPIRED: 'gray',
  OPEN: 'teal',
  WITHDRAWN: 'gray',
  // drivers and users
  VERIFIED: 'green',
  REJECTED: 'red',
  ONLINE: 'green',
  OFFLINE: 'gray',
  SUSPENDED: 'amber',
  DEACTIVATED: 'gray',
  // trust
  UNDER_REVIEW: 'blue',
  UPHELD: 'red',
  DISMISSED: 'gray',
  ACTIVE: 'red',
  OVERTURNED: 'green',
  REVOKED: 'gray',
  SENT: 'green',
};

export function StatusBadge({ status, tone }: { status: string; tone?: Tone }) {
  return <Badge tone={tone ?? STATUS_TONE[status] ?? 'gray'}>{humanize(status)}</Badge>;
}
