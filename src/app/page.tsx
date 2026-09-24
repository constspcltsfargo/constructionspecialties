import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Highlights } from '@/components/sections/highlights';
import { Services } from '@/components/sections/services';
import { Specialties } from '@/components/sections/specialties';
import { Gallery } from '@/components/sections/gallery';
import { Cta } from '@/components/sections/cta';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Highlights />
        <Services />
        <Specialties />
        <Gallery />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
