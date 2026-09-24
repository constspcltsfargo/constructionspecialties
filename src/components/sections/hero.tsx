'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/lib/projects';
import { ArrowButton } from '@/components/arrow-button';
import { TextReveal } from '@/components/motion/text-reveal';
import { ease } from '@/components/motion/reveal';

const INTERVAL = 6500;

const heroContent = {
  title: 'Your trusted North Dakota roofing company.',
  subtitle: 'Serving North Dakota, South Dakota, and Minnesota',
};

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = heroSlides.length;
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  const slide = heroSlides[index];

  return (
    <section
      className="relative isolate flex h-[calc(100svh-116px)] min-h-[560px] max-h-[900px] overflow-hidden bg-ink text-white"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: INTERVAL / 1000 + 1.5, ease: 'linear' }}
          >
            <Image src={slide.src} alt={slide.title} fill priority={index === 0} sizes="100vw" className="object-cover" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,10,10,0.82)_0%,rgba(10,10,10,0.55)_45%,rgba(10,10,10,0.15)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="container-x flex flex-1 flex-col justify-between pb-8 pt-16 md:pt-24">
        <div className="max-w-3xl">
          <motion.p
            className="eyebrow flex items-center gap-3 !text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <span className="h-px w-8 bg-primary" aria-hidden />
            Roofing & Construction — Commercial & Residential
          </motion.p>
          <TextReveal
            as="h1"
            immediate
            delay={0.2}
            text={heroContent.title}
            className="mt-6 text-[clamp(2.6rem,6.4vw,5.6rem)] font-semibold leading-[0.98] text-white"
          />
          <motion.p
            className="mt-6 max-w-xl text-lg text-white/75 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
          >
            {heroContent.subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
          >
            <ArrowButton href="/#contact">Get Your Free Estimate</ArrowButton>
            <ArrowButton href="/gallery" variant="outline-light" diagonal>
              View Our Work
            </ArrowButton>
          </motion.div>
        </div>

        <div
          className="flex items-end justify-between gap-6 border-t border-white/15 pt-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="min-w-0" aria-live="polite">
            <p className="font-mono text-xs text-white/50">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={slide.src}
                className="mt-1 truncate text-sm text-white/85"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {slide.title}
                {slide.location && <span className="text-white/50"> — {slide.location}</span>}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden gap-1.5 sm:flex">
              {heroSlides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.title}`}
                  aria-current={i === index}
                  className="relative h-8 w-10"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden bg-white/25">
                    {i === index && (
                      <motion.span
                        key={`${index}-${paused}`}
                        className="absolute inset-0 origin-left bg-white"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? 0 : 1 }}
                        transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: 'linear' }}
                      />
                    )}
                    {i < index && <span className="absolute inset-0 bg-white/60" />}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous project"
                className="grid size-10 place-items-center border border-white/25 transition-colors hover:bg-white hover:text-ink"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next project"
                className="-ml-px grid size-10 place-items-center border border-white/25 transition-colors hover:bg-white hover:text-ink"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
