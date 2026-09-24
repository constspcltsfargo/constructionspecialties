'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'motion/react';
import { imageFor } from '@/lib/projects';
import { SectionHeading } from '@/components/section-heading';
import { ArrowButton } from '@/components/arrow-button';
import { Reveal, ease } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

const services = [
  {
    image: imageFor('Ortho 2025'),
    title: 'Commercial Roofing',
    description:
      'Our commercial roofing solutions are custom-tailored to your business needs. Whether it’s a fresh installation, expert repairs, or proactive maintenance, we keep your property fully protected and secure.',
  },
  {
    image: imageFor('Residential CS LLC'),
    title: 'Residential Roofing',
    description:
      'From new roofs to emergency repairs, we safeguard your home with top-quality materials and expert craftsmanship, ensuring your family’s safety and comfort.',
  },
  {
    image: imageFor('thumbnail (2)'),
    title: 'Industrial and Agricultural Roofing',
    description:
      'For industrial and agricultural properties, we offer specialized roofing solutions designed to withstand the demanding environments of these facilities. Trust us to deliver durable and long-lasting roofing systems.',
  },
];

export function Services() {
  const [active, setActiveState] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const setActive = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActiveState(i);
    setNonce((n) => n + 1);
  };

  return (
    <section id="services" className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="Services"
          title="Our Services"
          description="We offer a comprehensive range of exterior services to meet all your needs."
        />

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <ol className="border-t lg:col-span-6">
            {services.map((s, i) => {
              const isActive = active === i;
              return (
                <Reveal as="li" key={s.title} delay={i * 0.08} className="border-b">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    className="group flex w-full items-start gap-6 py-7 text-left md:gap-10"
                  >
                    <span
                      className={cn(
                        'pt-2 font-mono text-xs transition-colors duration-300',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          'block font-display text-2xl font-semibold transition-[color,transform] duration-500 ease-out-expo md:text-[2rem] md:leading-tight',
                          isActive ? 'translate-x-0 text-foreground' : 'text-foreground/45 group-hover:translate-x-1'
                        )}
                        style={{ fontVariationSettings: "'wdth' 88" }}
                      >
                        {s.title}
                      </span>
                      <motion.span
                        initial={false}
                        animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.55, ease }}
                        className="block overflow-hidden"
                      >
                        <span className="block max-w-lg pt-4 text-muted-foreground">{s.description}</span>
                        <span className="relative mt-5 block aspect-[16/10] overflow-hidden lg:hidden">
                          <Image src={s.image} alt={s.title} fill sizes="100vw" className="object-cover" />
                        </span>
                      </motion.span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </ol>

          <Reveal className="hidden lg:col-span-6 lg:block" delay={0.1}>
            <div className="sticky top-28 aspect-[4/3.4] overflow-hidden bg-muted">
              {services.map((s, j) => {
                const shown = j === active || j === prev;
                return (
                  <motion.div
                    key={j === active ? `${s.title}-${nonce}` : s.title}
                    className="absolute inset-0"
                    style={{ zIndex: j === active ? 2 : j === prev ? 1 : 0 }}
                    initial={j === active && nonce > 0 ? { clipPath: 'inset(0 0 0 100%)' } : false}
                    animate={{ clipPath: shown ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)' }}
                    transition={{ duration: j === active ? 0.8 : 0, ease }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={j === active && nonce > 0 ? { scale: 1.1 } : false}
                      animate={{ scale: shown ? 1 : 1.1 }}
                      transition={{ duration: j === active ? 1.2 : 0, ease }}
                    >
                      <Image src={s.image} alt={s.title} fill sizes="50vw" className="object-cover" />
                    </motion.div>
                  </motion.div>
                );
              })}
              <span className="absolute bottom-4 left-4 z-10 bg-background px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                0{active + 1} — {services[active].title}
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <ArrowButton href="/#contact" variant="ink">
            Request a Free Consultation
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
