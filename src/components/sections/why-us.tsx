import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  "Locally Owned & Operated",
  "Fully Licensed & Insured",
  "Certified Roofing Experts",
  "Financing Options Available",
  "Lifetime Warranties",
  "Exceptional Customer Service",
];

export function WhyUs() {
    const whyUsImage = PlaceHolderImages.find((img) => img.id === "blog-post-2"); // Using a blog image as placeholder
  return (
    <section id="why-us" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Us for Your Next Project?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    We are dedicated to providing the highest quality of workmanship and customer service. Our team of experts is here to ensure your project is a success from start to finish.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0"/>
                            <span className="font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
                <Button asChild size="lg" className="rounded-full">
                    <Link href="#contact">Schedule Your Free Inspection</Link>
                </Button>
            </div>
            <div className="relative h-80 lg:h-[500px] rounded-lg overflow-hidden">
             {whyUsImage && (
                <Image
                    src={whyUsImage.imageUrl}
                    alt="Team of construction workers"
                    fill
                    className="object-cover"
                    data-ai-hint="construction workers"
                />
             )}
            </div>
        </div>
      </div>
    </section>
  );
}
