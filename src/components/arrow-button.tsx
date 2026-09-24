import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-[hsl(357_84%_40%)]',
  ink: 'bg-ink text-ink-foreground hover:bg-black',
  light: 'bg-ink-foreground text-ink hover:bg-white',
  outline: 'border border-foreground/20 text-foreground hover:border-foreground',
  'outline-light': 'border border-white/30 text-white hover:border-white',
} as const;

export type ArrowButtonVariant = keyof typeof variants;

export function arrowButtonClass(variant: ArrowButtonVariant = 'primary', className?: string) {
  return cn(
    'group/btn relative inline-flex h-12 items-center justify-between gap-6 rounded-sm pl-5 pr-4 text-[0.95rem] font-medium',
    'transition-colors duration-300 disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    className
  );
}

/** Icon that slides out and is replaced by a copy sliding in on hover. */
export function ArrowSwap({ diagonal = false }: { diagonal?: boolean }) {
  const Icon = diagonal ? ArrowUpRight : ArrowRight;
  const out = diagonal
    ? 'group-hover/btn:translate-x-full group-hover/btn:-translate-y-full'
    : 'group-hover/btn:translate-x-full';
  const inn = diagonal
    ? '-translate-x-full translate-y-full group-hover/btn:translate-x-0 group-hover/btn:translate-y-0'
    : '-translate-x-full group-hover/btn:translate-x-0';
  return (
    <span aria-hidden className="relative block size-4 overflow-hidden">
      <Icon className={cn('absolute inset-0 size-4 transition-transform duration-500 ease-out-expo', out)} />
      <Icon className={cn('absolute inset-0 size-4 transition-transform duration-500 ease-out-expo', inn)} />
    </span>
  );
}

type ArrowButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ArrowButtonVariant;
  className?: string;
  diagonal?: boolean;
};

export function ArrowButton({ href, children, variant = 'primary', className, diagonal }: ArrowButtonProps) {
  return (
    <Link href={href} className={arrowButtonClass(variant, className)}>
      <span>{children}</span>
      <ArrowSwap diagonal={diagonal} />
    </Link>
  );
}
