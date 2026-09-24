'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ease } from './reveal';

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  delay?: number;
};

/** Photo that unveils bottom-up with a slight settle in scale. Parent sets the size. */
export function ImageReveal({ src, alt, className, sizes = '100vw', priority, delay = 0 }: ImageRevealProps) {
  return (
    <motion.div
      className={cn('relative overflow-hidden bg-muted', className)}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease, delay }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.6, ease, delay }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
