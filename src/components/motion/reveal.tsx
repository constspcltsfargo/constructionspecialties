'use client';

import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

export const ease = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'section' | 'p' | 'span';
};

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/** Staggers the entrance of direct `StaggerItem` children. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul' | 'ol' | 'dl';
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={staggerParent}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  const Comp = motion[as];
  return (
    <Comp className={cn(className)} variants={staggerChild}>
      {children}
    </Comp>
  );
}
