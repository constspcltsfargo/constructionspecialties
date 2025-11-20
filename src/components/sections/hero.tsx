"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from '@/components/ui/card';

interface HeroImage {
    id: string;
    url: string;
    alt: string;
}
interface HeroContent {
    title: string;
    subtitle: string;
    images: HeroImage[];
}

const fallbackImages: HeroImage[] = [
    { id: 'hero-1', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FAnnex%20IMG_20250630_122752.jpg?alt=media&token=8b921d83-feb4-484f-bf8e-deb54d83444e', alt: 'Commercial building roofing project' },
    { id: 'hero-2', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FBig%20O%202%2020250629_173800_edited.jpg?alt=media&token=79cd26e1-ac45-4d11-9ed8-a296f0605ab4', alt: 'Big O Tires commercial roofing' },
    { id: 'hero-3', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FBismarck%20School%2020250629_144239.jpg?alt=media&token=5f563a8e-87be-4e19-96de-ff77617b4fac', alt: 'Bismarck School roofing project' },
    { id: 'hero-4', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FMSU%20Summer%2020250629_182401.jpg?alt=media&token=230268e8-27f7-4dd7-b15b-f54c13d7ba35', alt: 'MSU building roofing in summer' },
];

const heroContent: HeroContent = {
    title: "Your trusted North Dakota roofing company.",
    subtitle: "Serving North Dakota, South Dakota, and Minnesota",
    images: fallbackImages,
};

export function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <Carousel 
            className="w-full h-full"
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
            opts={{ loop: true }}
        >
            <CarouselContent>
                {heroContent.images.map((image) => (
                    <CarouselItem key={image.id}>
                        <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px]">
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="container text-center text-white px-6 md:px-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg text-white">
                   {heroContent.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200 drop-shadow-md">
                   {heroContent.subtitle}
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="#contact">Get Your Free Estimate</Link>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/gallery">View Our Work</Link>
                    </Button>
                </div>
            </div>
        </div>
    </section>
  );
}
