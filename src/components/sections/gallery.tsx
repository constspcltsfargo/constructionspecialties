'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";

interface Media {
    id: string;
    url: string;
    filename: string;
}

export function Gallery() {
  const firestore = useFirestore();
  
  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'media'),
      where('folder', '==', 'gallery'),
      orderBy('uploadDate', 'desc'),
      limit(10)
    );
  }, [firestore]);

  const { data: imagesToShow, isLoading } = useCollection<Media>(galleryQuery);

  if (isLoading) {
    return (
       <section id="gallery" className="py-12 md:py-24 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Recent Work</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Take a look at the quality craftsmanship and beautiful results we deliver.
            </p>
          </div>
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
             <div className="flex items-center justify-center md:justify-start [&_li]:mx-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-64 w-96" />)}
              </div>
          </div>
        </div>
      </section>
    )
  }
  
  if (!imagesToShow || imagesToShow.length === 0) {
    return null; // Don't render if there are no images
  }

  // Duplicate images for a seamless scrolling effect
  const duplicatedImages = [...imagesToShow, ...imagesToShow];

  return (
    <section id="gallery" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Recent Work</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Take a look at the quality craftsmanship and beautiful results we deliver.
          </p>
        </div>

        <div
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
             {duplicatedImages.map((image, index) => {
                if (!image) return null;
                return (
                   <li key={`${image.id}-${index}`} className="relative h-64 w-96 flex-shrink-0">
                       <Image
                        src={image.url}
                        alt={image.filename}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                  </li>
                );
             })}
          </ul>
           <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
             {duplicatedImages.map((image, index) => {
                if (!image) return null;
                return (
                   <li key={`${image.id}-duplicate-${index}`} className="relative h-64 w-96 flex-shrink-0">
                       <Image
                        src={image.url}
                        alt={image.filename}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                  </li>
                );
             })}
          </ul>
        </div>

        <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
                <Link href="/gallery">View Full Gallery <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
