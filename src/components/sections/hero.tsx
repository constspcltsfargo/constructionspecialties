import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <section className="relative min-h-[800px] md:h-[calc(100vh_-_80px)] flex items-center pt-20">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="relative z-10 container text-white px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="text-sm ml-2">Trusted by hundreds of homeowners</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
              Expert Roofing & Construction Services
            </h1>
            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/90 drop-shadow">
              Delivering top-quality craftsmanship and unparalleled customer service for all your home exterior needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-start gap-4">
              <Button size="lg" asChild className="rounded-full">
                <Link href="#contact">Get Your Free Estimate</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-foreground">
                <Link href="#services">Explore Our Services</Link>
              </Button>
            </div>
          </div>
          <div className="w-full max-w-md mx-auto">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
