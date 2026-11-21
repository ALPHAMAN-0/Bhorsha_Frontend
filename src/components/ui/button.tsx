import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-teal-700 text-white shadow-xs hover:bg-teal-800 focus-visible:outline-teal-700',
  secondary:
    'border border-slate-300 bg-white text-slate-800 shadow-xs hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 focus-visible:outline-rose-600',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant; size?: Size; loading?: boolean };

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
