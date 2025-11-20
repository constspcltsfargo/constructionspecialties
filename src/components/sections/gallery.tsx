'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { cn } from "@/lib/utils";


interface Media {
    id: string;
    filename: string;
    url: string;
    uploadDate: Timestamp;
}


export function Gallery() {
  const firestore = useFirestore();

  const mediaCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'media'), orderBy('uploadDate', 'desc'), limit(10));
  }, [firestore]);

  const { data: imagesToShow, isLoading } = useCollection<Media>(mediaCollectionRef);

  if (isLoading) {
    return null;
  }

  if (!imagesToShow || imagesToShow.length === 0) {
    return null; 
  }
  
  // Duplicate the images to create a seamless loop
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
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
             {duplicatedImages.map((image, index) => (
                <li key={`${image.id}-${index}`}>
                    <div className="group relative aspect-video w-72 sm:w-80 md:w-96 overflow-hidden rounded-lg">
                        <Image
                            src={image.url}
                            alt={image.filename}
                            fill
                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            sizes="(max-width: 768px) 80vw, 33vw"
                        />
                         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </li>
             ))}
          </ul>
           <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
             {duplicatedImages.map((image, index) => (
                <li key={`${image.id}-${index}-clone`}>
                    <div className="group relative aspect-video w-72 sm:w-80 md:w-96 overflow-hidden rounded-lg">
                        <Image
                            src={image.url}
                            alt={image.filename}
                            fill
                            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            sizes="(max-width: 768px) 80vw, 33vw"
                        />
                         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </li>
             ))}
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
