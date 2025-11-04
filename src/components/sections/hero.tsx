
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from '@/components/ui/button';

interface HeroContent {
    title: string;
    subtitle: string;
}

export function Hero({ content }: { content: HeroContent }) {
    const heroImage1 = PlaceHolderImages.find(img => img.id === 'hero-image-1');

    return (
        <section className="relative h-[600px] w-full flex items-center justify-center text-center text-white">
            {heroImage1 && (
                <Image 
                    src={heroImage1.imageUrl} 
                    alt={heroImage1.description} 
                    fill
                    className="object-cover -z-10"
                    data-ai-hint={heroImage1.imageHint}
                    priority
                />
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
