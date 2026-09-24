'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { navLinks, site, tel } from '@/lib/site';
import { SocialIcons } from '@/components/layout/social-icons';
import { ArrowButton } from '@/components/arrow-button';
import { ease } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

function UtilityBar() {
  return (
    <div className="bg-ink text-ink-foreground/60">
      <div className="container-x flex h-10 items-center justify-between text-[0.8rem]">
        <div className="flex items-center gap-5">
          {site.phones.map((p) => (
            <a key={p.label} href={tel(p.number)} className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="size-3.5" aria-hidden />
              <span>
                <span className="hidden sm:inline">{p.label}: </span>
                <span className="sm:hidden">{p.label}</span>
                <span className="hidden sm:inline">{p.number}</span>
              </span>
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="hidden items-center gap-2 transition-colors hover:text-white md:flex"
          >
            <Mail className="size-3.5" aria-hidden />
            {site.email}
          </a>
        </div>
        <SocialIcons className="hidden gap-4 sm:flex" iconClassName="size-3.5" />
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href.includes('#') ? false : href === pathname);

  return (
    <>
      <UtilityBar />
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease }}
        className={cn(
          'sticky top-0 z-50 border-b border-white/10 bg-ink text-ink-foreground transition-shadow duration-300',
          scrolled && 'shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_32px_-12px_rgba(0,0,0,0.5)]'
        )}
      >
        <nav className="container-x flex h-[76px] items-center justify-between gap-6" aria-label="Main">
          <Link href="/" className="shrink-0" aria-label={`${site.name} — home`}>
            <Image
              src="/brand/logo-white.png"
              alt={site.name}
              width={146}
              height={52}
              priority
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          <ul className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
            {navLinks.map((link) => (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'relative z-10 block px-4 py-2 text-[0.92rem] transition-colors duration-300',
                    isActive(link.href) ? 'text-white' : 'text-white/60 hover:text-white'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-4 -bottom-[19px] h-[2px] bg-primary" aria-hidden />
                  )}
                </Link>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-sm bg-white/[0.07]"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ArrowButton href="/#contact" className="hidden sm:inline-flex">
              Get a Free Estimate
            </ArrowButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative -mr-2 grid size-11 place-items-center lg:hidden"
            >
              <span
                className={cn(
                  'absolute h-[1.5px] w-6 bg-white transition-transform duration-500 ease-out-expo',
                  open ? 'rotate-45' : '-translate-y-[4px]'
                )}
              />
              <span
                className={cn(
                  'absolute h-[1.5px] w-6 bg-white transition-transform duration-500 ease-out-expo',
                  open ? '-rotate-45' : 'translate-y-[4px]'
                )}
              />
            </button>
          </div>
        </nav>

      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-ink pt-[116px] lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="container-x flex min-h-full flex-col justify-between gap-12 py-10">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
                className="divide-y divide-white/10 border-y border-white/10"
              >
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 font-display text-3xl font-semibold tracking-tight text-white"
                        style={{ fontVariationSettings: "'wdth' 88" }}
                    >
                      {link.label}
                      <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.45 } }}
                className="space-y-6 text-white/70"
              >
                <ArrowButton href="/#contact" className="w-full">
                  Get a Free Estimate
                </ArrowButton>
                <div className="space-y-2 text-sm">
                  {site.phones.map((p) => (
                    <a key={p.label} href={tel(p.number)} className="block">
                      {p.label}: {p.number}
                    </a>
                  ))}
                  <a href={`mailto:${site.email}`} className="block">
                    {site.email}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
