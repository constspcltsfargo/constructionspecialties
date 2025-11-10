
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id}>
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    className="h-auto max-w-full rounded-lg object-cover aspect-square"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
