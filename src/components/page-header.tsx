import { SectionHeading } from '@/components/section-heading';

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="border-b pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="container-x">
        <SectionHeading titleAs="h1" eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}
