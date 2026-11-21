import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './button';

/** A table that scrolls sideways on small screens instead of squeezing its columns. */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full min-w-max text-left text-sm', className)} {...props} />
    </div>
  );
}

export function THead(props: ComponentProps<'thead'>) {
  return <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase" {...props} />;
}

export function TBody(props: ComponentProps<'tbody'>) {
  return <tbody className="divide-y divide-slate-100" {...props} />;
}

export function TH({ className, ...props }: ComponentProps<'th'>) {
  return <th scope="col" className={cn('px-4 py-2.5 font-medium', className)} {...props} />;
}

export function TD({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('px-4 py-3 align-top text-slate-700', className)} {...props} />;
}

/** Previous / next for the page + limit lists; meta comes from the API. */
export function Pagination({
  page,
  limit,
  total,
  onPage,
}: {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit && page === 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
      <span>
        Page {page} of {pages} · {total} in total
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Next <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
