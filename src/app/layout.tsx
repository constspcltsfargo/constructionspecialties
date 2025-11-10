import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Roofing & Construction',
  description: 'Your trusted partner in roofing and construction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
