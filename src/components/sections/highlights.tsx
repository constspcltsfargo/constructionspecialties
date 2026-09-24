'use client';

import { NumberTicker } from '@/components/motion/number-ticker';
import { Stagger, StaggerItem } from '@/components/motion/reveal';

const items = [
  { value: 38, label: 'Years of dedicated service' },
  { value: 3, label: 'States served — ND, SD & MN' },
  { value: 2, label: 'Offices — Fargo & Minot' },
  { text: 'Free', label: 'Estimates on every project' },
];

export function Highlights() {
  return (
    <section aria-label="At a glance" className="border-b bg-background">
      <Stagger className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <StaggerItem
            key={item.label}
            className={[
              'py-8 md:py-10',
              i % 2 === 1 ? 'border-l pl-5 sm:pl-8' : 'pr-5',
              i >= 2 ? 'border-t lg:border-t-0' : '',
              i === 2 ? 'lg:border-l lg:pl-8' : '',
            ].join(' ')}
          >
            <p className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {'text' in item ? item.text : <NumberTicker value={item.value!} suffix={item.suffix} />}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
