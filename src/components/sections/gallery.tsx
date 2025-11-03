
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

const galleryImages = [
  { imageId: "gallery-1", category: "Roofing" },
  { imageId: "gallery-4", category: "Siding" },
  { imageId: "gallery-3", category: "Gutters" },
  { imageId: "gallery-5", category: "Repairs" },
  { imageId: "gallery-2", category: "Inspections" },
  { imageId: "gallery-6", category: "Windows" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Recent Work</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Take a look at the quality craftsmanship and beautiful results we deliver.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((item, index) => {
            const image = PlaceHolderImages.find((img) => img.id === item.imageId);
            return (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                {image && (
                   <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    className="object-cover aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <h3 className="text-white font-semibold text-lg">{item.category}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild className="rounded-full">
                <Link href="/gallery">View Full Gallery <ArrowRight className="ml-2"/></Link>
            </Button>
        </div>
      </div>
    </section>
  );
}

    