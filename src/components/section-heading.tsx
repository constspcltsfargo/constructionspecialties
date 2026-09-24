import { cn } from '@/lib/utils';
import { TextReveal } from '@/components/motion/text-reveal';
import { Reveal } from '@/components/motion/reveal';

type SectionHeadingProps = {
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  tone?: 'light' | 'dark';
  titleAs?: 'h1' | 'h2';
};

/** Two-column section intro: label + headline on the left, supporting copy on the right. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
  tone = 'light',
  titleAs = 'h2',
}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <div className={cn('grid gap-6 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-7">
        <Reveal as="p" className={cn('eyebrow flex items-center gap-3', dark && '!text-white/60')} y={8}>
          {index && <span className={dark ? 'text-white' : 'text-foreground'}>{index}</span>}
          <span className="h-px w-8 bg-primary" aria-hidden />
          {eyebrow}
        </Reveal>
        <TextReveal
          as={titleAs}
          text={title}
          className={cn(
            'mt-5 text-[clamp(2.2rem,4.6vw,3.9rem)] font-semibold leading-[1.02]',
            dark && 'text-white'
          )}
        />
      </div>
      {description && (
        <Reveal
          delay={0.15}
          className={cn('text-lg lg:col-span-5 lg:pb-2', dark ? 'text-white/65' : 'text-muted-foreground')}
        >
          <p>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
