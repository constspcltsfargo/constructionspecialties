import type { Metadata } from 'next';
import './globals.css';
import { Archivo, Inter, IBM_Plex_Mono } from 'next/font/google';
import { MotionProvider } from '@/components/motion/motion-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(/^https?:\/\//.test(siteUrl) ? siteUrl : `https://${siteUrl}`),
  title: {
    default: 'Construction Specialties LLC — Roofing & Construction',
    template: '%s — Construction Specialties LLC',
  },
  description:
    'Commercial, residential, agricultural and industrial roofing across North Dakota, South Dakota and Minnesota. Certified Mule-Hide installer. Free estimates.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`overflow-x-clip ${inter.variable} ${archivo.variable} ${mono.variable} font-sans antialiased`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
