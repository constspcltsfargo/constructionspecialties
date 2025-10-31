import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { WhyUs } from "@/components/sections/why-us";
import { Testimonials } from "@/components/sections/testimonials";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
