import { cn } from '@/lib/cn';

/** ভ is the first letter of ভরসা (Bhorsha, "trust"). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className="grid size-8 place-items-center rounded-lg bg-teal-700 text-lg leading-none font-bold text-white"
        aria-hidden
      >
        ভ
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900">Bhorsha</span>
    </span>
  );
}
