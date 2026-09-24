import Image from 'next/image';
import Link from 'next/link';
import { site, tel } from '@/lib/site';
import { SocialIcons } from '@/components/layout/social-icons';

const quickLinks = [
  { href: '/#services', label: 'Our Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About Us' },
  { href: '/#contact', label: 'Contact Us' },
];

const serviceLinks = [
  { href: '/#services', label: 'Residential Roofing' },
  { href: '/#services', label: 'Commercial Roofing' },
  { href: '/#specialties', label: 'Storm Damage' },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-muted-foreground transition-[background-size,color] duration-500 ease-out-expo hover:bg-[length:100%_1px] hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Image
            src="/brand/logo.png"
            alt={site.name}
            width={224}
            height={108}
            className="h-auto w-56"
          />
          <p className="mt-6 max-w-xs text-muted-foreground">{site.tagline}</p>
          <SocialIcons className="mt-6 gap-5 text-muted-foreground" />
        </div>

        <nav className="md:col-span-2" aria-label="Quick links">
          <h4 className="eyebrow mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label="Services">
          <h4 className="eyebrow mb-5">Our Services</h4>
          <ul className="space-y-3 text-sm">
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h4 className="eyebrow mb-5">Contact Info</h4>
          <address className="space-y-3 text-sm not-italic text-muted-foreground">
            <p>
              {site.address.street}
              <br />
              {site.address.city}
            </p>
            <p>
              <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
            </p>
            {site.phones.map((p) => (
              <p key={p.label}>
                <span className="text-foreground">{p.label}:</span>{' '}
                <FooterLink href={tel(p.number)}>{p.number}</FooterLink>
              </p>
            ))}
          </address>
        </div>
      </div>

      <div className="border-t">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Construction Specialties & Roofing. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.14em]">ND · SD · MN</p>
        </div>
      </div>
    </footer>
  );
}
