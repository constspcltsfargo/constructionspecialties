
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));
  const categories = [...new Set(galleryImages.map(img => {
      const match = img.id.match(/^gallery-(\d+)/);
      if(!match) return 'General';
      const num = parseInt(match[1]);
      if(num <= 2) return 'Roofing';
      if(num <= 4) return 'Siding';
      if(num <= 6) return 'Windows';
      if(num <= 8) return 'Renovations';
      if(num <= 10) return 'Commercial';
      return 'Outdoor';
  }))]

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    className="object-cover aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white text-sm">{image.description}</p>
                  </div>
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

    