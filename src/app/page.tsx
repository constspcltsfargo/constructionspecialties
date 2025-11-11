'use client';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Cta } from "@/components/sections/cta";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Gallery />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
