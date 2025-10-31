import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <section className="relative h-[60vh] min-h-[400px] sm:h-[70vh] md:h-screen flex items-center justify-center">
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
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-md font-headline">
          Your Trusted Partner in Construction
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow">
          Quality roofing and construction services you can rely on. Built to last, designed to impress.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="#contact">Get a Free Quote</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#services">Our Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
