import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { ApiError, errorMessage } from '@/lib/api/errors';
import { cn } from '@/lib/cn';

type AlertTone = 'info' | 'success' | 'warning' | 'error';

const STYLES: Record<AlertTone, { box: string; Icon: typeof Info }> = {
  info: { box: 'border-sky-200 bg-sky-50 text-sky-900', Icon: Info },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icon: CircleCheck },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', Icon: TriangleAlert },
  error: { box: 'border-rose-200 bg-rose-50 text-rose-900', Icon: CircleAlert },
};

export function Alert({
  tone = 'info',
  title,
  className,
  children,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const { box, Icon } = STYLES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-lg border px-4 py-3 text-sm', box, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 space-y-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}

/** Shows what the backend said when a call was refused, with its request id for the logs. */
export function ErrorAlert({ error, title, className }: { error: unknown; title?: string; className?: string }) {
  if (!error) return null;
  const requestId = error instanceof ApiError ? error.requestId : undefined;
  return (
    <Alert tone="error" title={title} className={className}>
      {errorMessage(error)}
      {requestId && <span className="mt-1 block font-mono text-xs opacity-70">Request id {requestId}</span>}
    </Alert>
  );
}
