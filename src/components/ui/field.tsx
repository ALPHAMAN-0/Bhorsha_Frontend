import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** A labelled form control with an optional hint, or the field's error in its place. */
export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-rose-600">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

const CONTROL =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-xs ' +
  'placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 aria-invalid:border-rose-500';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(CONTROL, 'h-10', className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(CONTROL, 'h-10 pr-8', className)} {...props} />;
}

export function Textarea({ className, rows = 3, ...props }: ComponentProps<'textarea'>) {
  return <textarea rows={rows} className={cn(CONTROL, 'py-2', className)} {...props} />;
}

/** A row of mutually exclusive choices that looks like buttons (radio inputs underneath). */
export function Segmented<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: ReactNode; disabled?: boolean }>;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700',
            value === option.value
              ? 'border-teal-700 bg-teal-50 text-teal-900'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            option.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <input
            type="radio"
            name={name}
            className="sr-only"
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
