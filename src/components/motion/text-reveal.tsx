'use client';

import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ease } from './reveal';

type TextRevealProps = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Word-by-word masked rise. Each word slides up from behind its own line,
 * which reads like type being set rather than a generic fade.
 */
export function TextReveal({ text, as = 'h2', className, delay = 0, immediate = false }: TextRevealProps) {
  const Comp = motion[as];
  const words = text.split(' ');
  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } };

  return (
    <Comp
      className={className}
      aria-label={text}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '105%' },
                show: { y: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Comp>
  );
}
