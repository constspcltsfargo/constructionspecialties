import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
  gap?: string;
  pauseOnHover?: boolean;
};

/** Seamless horizontal loop. Content is rendered twice; the copy is hidden from assistive tech. */
export function Marquee({ children, className, duration = 60, gap = '1rem', pauseOnHover = true }: MarqueeProps) {
  return (
    <div
      className={cn('group flex overflow-hidden [gap:var(--gap)]', className)}
      style={{ '--duration': `${duration}s`, '--gap': gap } as React.CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            'flex shrink-0 animate-marquee [gap:var(--gap)]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
