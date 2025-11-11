
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
    { id: 'hero-5', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FMinot%20DOT%202%2020250629_174127.jpg?alt=media&token=226d6f49-7a9f-47f3-aa3a-6a545fe3f330', alt: 'Minot DOT building roofing project' },
    { id: 'hero-6', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FRPZ%20Tiger%2020250630_124936.jpg?alt=media&token=6ba8f8e2-2fbc-4eb1-a302-7ff7d365fe94', alt: 'RPZ Tiger commercial roofing' },
    { id: 'hero-7', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FStarbucks%202%2020250629_184237.jpg?alt=media&token=2a8e0bf2-a1b0-41b3-96a8-ac2ddc2790f9', alt: 'Starbucks commercial roofing' },
    { id: 'hero-8', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2Fbottineau-county-sheriffs-office.jpg?alt=media&token=af5da1dc-8a4b-4134-a5b6-0bf733399cfc', alt: 'Bottineau County Sheriffs Office roofing' },
];

const defaultContent = {
    title: "Your Trusted Orlando <span class=\"text-primary [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]\">Roofing Company.</span>",
    subtitle: "Providing quality roof services to Central Florida homeowners and businesses since 2003. We are a local, family-owned roofing company dedicated to providing our customers with the best roofing services possible.",
    images: fallbackImages,
}


export function Hero({ content: contentFromProps }: { content?: HeroContent }) {
    
    const content = contentFromProps || defaultContent;
    const imagesToDisplay = (content.images && content.images.length > 0) ? content.images : [];
    const hasImages = imagesToDisplay.length > 0;

    return (
        <section className="relative w-full flex items-center justify-center text-center text-white">
             {hasImages ? (
                <Carousel
                    className="w-full"
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent className="h-[600px] m-0">
                        {imagesToDisplay.map((image, index) => (
                             <CarouselItem key={image.id} className="p-0">
                                <Card className="h-full w-full rounded-none border-none">
                                    <CardContent className="relative flex h-full w-full items-center justify-center p-0">
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                            sizes="100vw"
                                        />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 z-10 bg-black/30 text-white border-white/50 hover:bg-black/50 hover:text-white" />
                    <CarouselNext className="absolute right-4 z-10 bg-black/30 text-white border-white/50 hover:bg-black/50 hover:text-white" />
                </Carousel>
             ) : (
                <div className="w-full h-[600px] bg-gray-300" />
             )}
            <div className="absolute inset-0 bg-black/50" />

            <div className="container px-4 md:px-6 absolute z-10">
                <div className="space-y-6 max-w-3xl mx-auto">
                    <h1 
                        className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                        dangerouslySetInnerHTML={{ __html: content.title }}
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
