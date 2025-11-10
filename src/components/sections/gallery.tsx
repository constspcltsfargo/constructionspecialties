
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const galleryImages = [
  { imageId: "gallery-1" },
  { imageId: "gallery-4" },
  { imageId: "gallery-3" },
  { imageId: "gallery-5" },
  { imageId: "gallery-2" },
  { imageId: "gallery-6" },
  { imageId: "gallery-7" },
  { imageId: "gallery-8" },
  { imageId: "gallery-9" },
  { imageId: "gallery-10" },
];

export function Gallery() {
  const duplicatedImages = [...galleryImages, ...galleryImages];

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
             {duplicatedImages.map((item, index) => {
                const image = PlaceHolderImages.find((img) => img.id === item.imageId);
                return (
                   <li key={index} className="group relative overflow-hidden rounded-lg">
                    {image && (
                       <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        className="object-cover aspect-[4/3] w-full max-w-sm"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </li>
                );
             })}
          </ul>
           <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
             {duplicatedImages.map((item, index) => {
                const image = PlaceHolderImages.find((img) => img.id === item.imageId);
                return (
                   <li key={index} className="group relative overflow-hidden rounded-lg">
                    {image && (
                       <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        className="object-cover aspect-[4/3] w-full max-w-sm"
                        data-ai-hint={image.imageHint}
                      />
                    )}
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
