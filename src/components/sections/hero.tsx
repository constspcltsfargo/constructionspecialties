"use client";
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

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

export function Hero({ content }: { content: HeroContent }) {
    
    const hasImages = content.images && content.images.length > 0;

    return (
        <section className="relative h-[600px] w-full flex items-center justify-center text-center text-white">
             {hasImages ? (
                <Carousel
                    className="w-full h-full"
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                >
                    <CarouselContent className="h-full">
                        {content.images.map((image) => (
                            <CarouselItem key={image.id} className="h-full">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover -z-10"
                                    priority
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4" />
                    <CarouselNext className="absolute right-4" />
                </Carousel>
             ) : (
                <div className="w-full h-full bg-gray-300 -z-10" />
             )}
            <div className="absolute inset-0 bg-black/50 -z-10" />

            <div className="container px-4 md:px-6">
                <div className="space-y-6 max-w-3xl mx-auto">
                    <h1 
                        className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                        dangerouslySetInnerHTML={{ __html: content.title.replace(/<span.*?>/g, '<span class="text-primary">').replace(/<\/span>/g, '</span>') }}
                    />
                    <p className="text-lg md:text-xl text-gray-200">
                        {content.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <Button asChild size="lg">
                           <Link href="#contact">Get a Free Estimate</Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary">
                            <Link href="#contact">Schedule Inspection</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
