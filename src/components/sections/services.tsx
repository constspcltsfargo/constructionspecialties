
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Services%20Photos%2FCommercial%20Roofing.avif?alt=media&token=a84e5e2d-66dd-4a2d-b147-9863bc451dfb",
    imageHint: "commercial building",
    title: "Commercial Roofing",
    description: "Our commercial roofing solutions are custom-tailored to your business needs. Whether it’s a fresh installation, expert repairs, or proactive maintenance, we keep your property fully protected and secure.",
  },
  {
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Services%20Photos%2FResedential%20Roofing.avif?alt=media&token=03b78654-6274-4822-b242-75e9b710fd12",
    imageHint: "residential house",
    title: "Residential Roofing",
    description: "From new roofs to emergency repairs, we safeguard your home with top-quality materials and expert craftsmanship, ensuring your family’s safety and comfort.",
  },
  {
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Services%20Photos%2FIndustrial%20roofing.avif?alt=media&token=24f19f81-3d91-4719-9afd-d1e14f0632ae",
    imageHint: "farm building",
    title: "Industrial and Agricultural Roofing",
    description: "Our robust roofing systems are built to withstand the rigorous demands of industrial and agricultural environments, ensuring your operations continue without interruption.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            We offer a comprehensive range of exterior services to meet all your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col overflow-hidden text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0 relative h-56 w-full">
                    <Image 
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        data-ai-hint={service.imageHint}
                    />
                </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-muted-foreground flex-1">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="#contact">Request a Free Consultation</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
