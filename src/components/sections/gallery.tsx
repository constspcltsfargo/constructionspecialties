'use client';

import Image from 'next/image';
import Link from 'next/link';
import { featuredProjects } from '@/lib/projects';
import { SectionHeading } from '@/components/section-heading';
import { ArrowButton } from '@/components/arrow-button';
import { Marquee } from '@/components/motion/marquee';
import { Reveal } from '@/components/motion/reveal';

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Recent work"
          title="Our Recent Work"
          description="Take a look at the quality craftsmanship and beautiful results we deliver."
        />
      </div>

      <Reveal className="mt-16 lg:mt-20" y={40}>
        <Marquee duration={90} gap="1.25rem">
          {featuredProjects.map((project) => (
            <Link
              key={project.src}
              href="/gallery"
              className="group block w-[78vw] shrink-0 sm:w-[420px]"
              aria-label={`${project.title} — view gallery`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  sizes="(min-width: 640px) 420px, 78vw"
                  className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="truncate font-medium">{project.title}</p>
                <p className="eyebrow shrink-0">{project.category}</p>
              </div>
            </Link>
          ))}
        </Marquee>
      </Reveal>

      <div className="container-x mt-14">
        <Reveal>
          <ArrowButton href="/gallery" variant="outline" diagonal>
            View Full Gallery
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
