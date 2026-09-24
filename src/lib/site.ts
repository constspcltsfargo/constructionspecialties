export const site = {
  name: 'Construction Specialties LLC',
  shortName: 'Construction Specialties',
  tagline: 'Quality you can trust, service you can count on.',
  email: 'constspcltsfargo@gmail.com',
  address: { street: '1124 5th Ave NE', city: 'West Fargo, ND 58078' },
  phones: [
    { label: 'Fargo', number: '218-303-7566' },
    { label: 'Minot', number: '701-852-1633' },
  ],
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About Us' },
  { href: '/#contact', label: 'Contact' },
];

export const socialLinks = [
  { href: '#', label: 'Facebook' },
  { href: '#', label: 'Twitter' },
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'LinkedIn' },
  { href: '#', label: 'YouTube' },
] as const;

export const tel = (number: string) => `tel:${number}`;
