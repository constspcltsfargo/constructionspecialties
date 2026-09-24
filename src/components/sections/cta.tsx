'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { imageFor } from '@/lib/projects';
import { site, tel } from '@/lib/site';
import { ArrowButton } from '@/components/arrow-button';
import { TextReveal } from '@/components/motion/text-reveal';
import { Reveal } from '@/components/motion/reveal';

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink py-28 text-white md:py-40">
      <motion.div className="absolute inset-[-14%_0] -z-10" style={{ y }}>
        <Image src={imageFor('Minot Airport Fire Station')} alt="" fill sizes="100vw" className="object-cover opacity-30" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <TextReveal
            text="Ready to Start Your Project?"
            className="text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1] text-white"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg text-white/70 md:text-xl">
              Contact us today for a free, no-obligation estimate and let&apos;s turn your vision into reality.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10">
            <ArrowButton href="/#contact">Get Your Free Estimate</ArrowButton>
          </Reveal>
        </div>
        <Reveal delay={0.3} className="space-y-4 border-l border-white/15 pl-6 lg:col-span-4">
          {site.phones.map((p) => (
            <a key={p.label} href={tel(p.number)} className="group block">
              <span className="eyebrow !text-white/50">{p.label}</span>
              <span className="mt-1 block font-display text-2xl font-semibold text-white transition-colors group-hover:text-primary md:text-3xl">
                {p.number}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
