import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/page-header';
import { SectionHeading } from '@/components/section-heading';
import { Cta } from '@/components/sections/cta';
import { ImageReveal } from '@/components/motion/image-reveal';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { imageFor } from '@/lib/projects';
import { site, tel } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    '38 years of roofing in ND, SD and MN. Learn more about Construction Specialties LLC, our mission, and the team behind our work.',
};

function OurStory() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="flex aspect-[4/3] items-center justify-center border bg-card p-10">
            <Image
              src="/brand/logo.png"
              alt="Construction Specialties LLC logo"
              width={384}
              height={185}
              className="h-auto w-full max-w-sm"
            />
          </div>
          <div className="mt-4 flex items-center gap-4 border bg-card p-5">
            <span className="grid size-12 shrink-0 place-items-center bg-ink font-mono text-xs text-white">MH</span>
            <div>
              <p className="font-medium">Certified Mule-Hide Installer</p>
              <p className="text-sm text-muted-foreground">Backed by full manufacturer warranty</p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal as="p" className="eyebrow flex items-center gap-3" y={8}>
            <span className="text-foreground">01</span>
            <span className="h-px w-8 bg-primary" aria-hidden />
            Our story
          </Reveal>
          <Reveal>
            <h2 className="mt-5 text-[clamp(2.2rem,4.6vw,3.9rem)] font-semibold leading-[1.02]">Our Story</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              <span className="text-foreground">Construction Specialties LLC Roofing Professionals</span> is a trusted
              and experienced roofing contractor with 38 years of dedicated service in ND, SD, and MN. Our
              commitment to quality craftsmanship and customer satisfaction sets us apart. We take pride in offering
              professional roofing services for commercial, residential, agricultural, and industrial properties.
            </p>
            <p>
              Our expertise includes repairs, maintenance, and retrofits. As a certified Mule Hide installer, we ensure
              high-quality materials backed by full manufacturer warranty. Our specialization in flat and EPDM (rubber)
              roofing, metal roofing, sheet metal fabrication, storm damage, and seamless gutters makes us a reliable
              choice for all roofing needs. At Construction Specialties LLC, we are dedicated to providing free
              estimates and delivering exceptional results.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const values = [
  {
    title: 'Quality',
    body: 'Using only the best materials and certified installers to ensure your project stands the test of time.',
  },
  {
    title: 'Integrity',
    body: 'Operating with honesty and transparency in every interaction, from the initial estimate to the final inspection.',
  },
  {
    title: 'Customer Satisfaction',
    body: "Ensuring you are completely satisfied with our work is our top priority. We're not happy until you are.",
  },
];

function OurMission() {
  return (
    <section className="bg-ink py-24 text-white md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading tone="dark" index="02" eyebrow="Mission" title="Our Mission & Values" className="!grid-cols-1" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg text-white/65">
              Our mission is to deliver superior roofing and construction solutions through quality materials, expert
              workmanship, and a customer-first approach. We are guided by our core values:
            </p>
          </Reveal>
          <Stagger as="ol" className="mt-12 border-t border-white/10">
            {values.map((v, i) => (
              <StaggerItem as="li" key={v.title} className="grid grid-cols-[3rem_1fr] border-b border-white/10 py-6">
                <span className="pt-1 font-mono text-xs text-primary">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{v.title}</h3>
                  <p className="mt-2 text-white/60">{v.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <ImageReveal
          src={imageFor('Park Christian School')}
          alt="Completed roofing project at Park Christian School"
          className="aspect-[4/5] lg:col-span-6 lg:aspect-auto"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    </section>
  );
}

const teamMembers = [
  { name: 'Keith Hilde', role: 'Owner' },
  { name: 'Dave Baum', role: 'Senior Roofing Specialist' },
];

function MeetTheTeam() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Team"
          title="Meet the Team"
          description="The passionate professionals dedicated to bringing your vision to life."
        />
        <Stagger className="mt-16 grid max-w-3xl gap-5 sm:grid-cols-2 lg:mt-20">
          {teamMembers.map((member) => (
            <StaggerItem key={member.name} className="group">
              <div className="relative flex aspect-[5/4] flex-col justify-between overflow-hidden bg-ink p-6 text-white">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">{member.role}</span>
                <span
                  className="font-display text-[5.5rem] font-semibold leading-none tracking-tight text-white/90 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                  aria-hidden
                >
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ServiceArea() {
  return (
    <section className="border-t bg-secondary/60 py-20 md:py-24">
      <div className="container-x grid gap-10 md:grid-cols-3">
        <Reveal>
          <p className="eyebrow">Service area</p>
          <p className="mt-4 font-display text-3xl font-semibold">North Dakota, South Dakota & Minnesota</p>
        </Reveal>
        {site.phones.map((p, i) => (
          <Reveal key={p.label} delay={0.1 * (i + 1)} className="border-t pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="eyebrow">{p.label} office</p>
            {p.label === 'Fargo' && (
              <p className="mt-4 text-muted-foreground">
                {site.address.street}, {site.address.city}
              </p>
            )}
            <a href={tel(p.number)} className="mt-2 block font-display text-2xl font-semibold transition-colors hover:text-primary">
              {p.number}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="About"
          title="About Us"
          description="Learn more about our company, our mission, and the dedicated team behind our success."
        />
        <ImageReveal
          src={imageFor('Bismarck School 2025')}
          alt="Completed roof on a Bismarck school"
          className="aspect-[21/9] w-full"
          sizes="100vw"
          priority
        />
        <OurStory />
        <OurMission />
        <MeetTheTeam />
        <ServiceArea />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
