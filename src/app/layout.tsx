import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Roofing & Construction',
  description: 'Your trusted partner in roofing and construction.',
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/CS%20LLC%20New%20logo%202.png?alt=media&token=587016e6-9e7f-4622-a454-7088936b0642',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
