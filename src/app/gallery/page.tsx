
'use client';

import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';

interface Media {
    id: string;
    filename: string;
    url: string;
    uploadDate: Timestamp;
}

export default function GalleryPage() {
  const firestore = useFirestore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const mediaCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'media'), orderBy('uploadDate', 'desc'));
  }, [firestore]);

  const { data: galleryImages, isLoading } = useCollection<Media>(mediaCollectionRef);

  const selectedImage = selectedIndex !== null && galleryImages ? galleryImages[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex === null || !galleryImages) return;
    setSelectedIndex((prevIndex) => (prevIndex! + 1) % galleryImages.length);
  };

  const handlePrevious = () => {
    if (selectedIndex === null || !galleryImages) return;
    setSelectedIndex((prevIndex) => (prevIndex! - 1 + galleryImages.length) % galleryImages.length);
  };

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {galleryImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => setSelectedIndex(index)}
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
                  ))}
                </div>
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

      <Dialog open={selectedIndex !== null} onOpenChange={(isOpen) => !isOpen && setSelectedIndex(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
            {selectedImage && (
                <>
                    <DialogTitle className="sr-only">{selectedImage.filename}</DialogTitle>
                    <div className="relative aspect-video">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.filename}
                            fill
                            sizes="100vw"
                            className="object-contain rounded-lg"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white border-white/50 hover:bg-black/50 hover:text-white" onClick={handlePrevious}>
                        <ChevronLeft className="h-6 w-6" />
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white border-white/50 hover:bg-black/50 hover:text-white" onClick={handleNext}>
                        <ChevronRight className="h-6 w-6" />
                        <span className="sr-only">Next</span>
                    </Button>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
