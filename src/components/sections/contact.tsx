import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { site, tel } from '@/lib/site';

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t bg-secondary/60 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow="Contact"
          title="Contact Us"
          description="We're ready to help with your next project. Reach out to us today for a free estimate!"
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h3 className="text-2xl font-semibold">Our Information</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              Use the form to send us a message, or contact us directly using the information below. We look forward
              to hearing from you.
            </p>
            <ul className="mt-10 divide-y border-y">
              <li className="flex gap-5 py-5">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}
                </span>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="group flex items-center gap-5 py-5">
                  <Mail className="size-5 shrink-0 text-primary" aria-hidden />
                  <span className="break-all transition-colors group-hover:text-primary">{site.email}</span>
                </a>
              </li>
              {site.phones.map((p) => (
                <li key={p.label}>
                  <a href={tel(p.number)} className="group flex items-center gap-5 py-5">
                    <Phone className="size-5 shrink-0 text-primary" aria-hidden />
                    <span className="transition-colors group-hover:text-primary">
                      {p.label}: {p.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="border bg-card p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)] sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
