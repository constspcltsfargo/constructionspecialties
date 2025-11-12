
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Media {
    id: string;
    filename: string;
    url: string;
    uploadDate: Timestamp;
}

export default function GalleryPage() {
  const firestore = useFirestore();
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);

  const mediaCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'media'), orderBy('uploadDate', 'desc'));
  }, [firestore]);

  const { data: galleryImages, isLoading } = useCollection<Media>(mediaCollectionRef);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <section className="py-12 md:py-24 bg-secondary">
            <div className="container text-center">
              <h1 className="text-4xl md:text-5xl font-bold">Our Gallery</h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                Browse through our collection of completed projects. See the quality and craftsmanship we bring to every job.
              </p>
            </div>
          </section>
          <section className="py-12 md:py-24">
            <div className="container">
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                  ))}
                </div>
              )}
              {!isLoading && galleryImages && (
                <TooltipProvider>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {galleryImages.map((image) => (
                       <Tooltip key={image.id}>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => setSelectedImage(image)}
                            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                          >
                            <Image
                              src={image.url}
                              alt={image.filename}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to enlarge</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              )}
              {!isLoading && galleryImages && galleryImages.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <h3 className="text-lg font-semibold">The Gallery is Empty</h3>
                  <p className="text-muted-foreground mt-2">Check back later, or upload photos in the admin dashboard to populate the gallery.</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-2">
            {selectedImage && (
                <>
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedImage.filename}</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-video">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.filename}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
