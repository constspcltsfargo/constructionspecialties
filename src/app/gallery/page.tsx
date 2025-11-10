
'use client';

import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Media {
    id: string;
    url: string;
    filename: string;
}

export default function GalleryPage() {
  const firestore = useFirestore();
  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'media'),
      where('folder', '==', 'gallery'),
      orderBy('uploadDate', 'desc')
    );
  }, [firestore]);

  const { data: galleryImages, isLoading } = useCollection<Media>(galleryQuery);


  return (
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => (
                       <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                    ))}
                </div>
            )}
            {!isLoading && galleryImages && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image) => (
                  <div key={image.id}>
                    <Image
                      src={image.url}
                      alt={image.filename}
                      width={600}
                      height={400}
                      className="h-auto max-w-full rounded-lg object-cover aspect-square"
                    />
                  </div>
                ))}
              </div>
            )}
             {!isLoading && galleryImages && galleryImages.length === 0 && (
                <p className="text-center text-muted-foreground">No gallery images have been uploaded yet.</p>
             )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
