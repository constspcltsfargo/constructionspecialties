'use client';

import { SectionHeading } from '@/components/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { ImageReveal } from '@/components/motion/image-reveal';
import { imageFor } from '@/lib/projects';

const specialties = [
  {
    title: 'Flat & EPDM Roofing',
    body: 'Rubber membrane systems for low-slope commercial, industrial and multi-family roofs.',
  },
  {
    title: 'Metal Roofing',
    body: 'Long-lasting metal roof systems for homes, shops and agricultural buildings.',
  },
  {
    title: 'Sheet Metal Fabrication',
    body: 'Flashing, coping and trim fabricated to fit the details of each roof.',
  },
  {
    title: 'Storm Damage',
    body: 'Inspection and repair after hail and wind so small damage doesn’t become a big leak.',
  },
  {
    title: 'Seamless Gutters',
    body: 'Continuous gutters custom-fit to your roofline, with fewer joints to leak.',
  },
  {
    title: 'Repairs, Maintenance & Retrofits',
    body: 'Extend the life of an existing roof, or bring it up to date without starting over.',
  },
];

export function Specialties() {
  return (
    <section id="specialties" className="scroll-mt-20 bg-ink py-24 text-white md:py-32">
      <div className="container-x">
        <SectionHeading
          tone="dark"
          index="02"
          eyebrow="Specialties"
          title="Built for northern weather."
          description="38 years of roofing across ND, SD and MN. The systems we install, repair and maintain every season:"
        />

        <Stagger as="ol" className="mt-16 grid border-l border-t border-white/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {specialties.map((s, i) => (
            <StaggerItem
              as="li"
              key={s.title}
              className="group relative border-b border-r border-white/10 p-7 transition-colors duration-500 hover:bg-white/[0.03] md:p-9"
            >
              <span
                className="absolute left-0 top-0 h-[2px] w-0 bg-primary transition-[width] duration-700 ease-out-expo group-hover:w-full"
                aria-hidden
              />
              <span className="font-mono text-xs text-white/40">0{i + 1}</span>
              <h3 className="mt-10 text-2xl font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-white/60">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-12">
          <ImageReveal
            src={imageFor('Kia 1')}
            alt="Completed commercial roof on a Kia dealership"
            className="aspect-[16/10] lg:col-span-7"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <Reveal className="lg:col-span-5 lg:pl-6" delay={0.1}>
            <p className="eyebrow !text-white/60">Certified installer</p>
            <p className="mt-5 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
              Certified Mule-Hide installer.
            </p>
            <p className="mt-5 text-lg text-white/65">
              High-quality materials backed by full manufacturer warranty — and free estimates on every project.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
