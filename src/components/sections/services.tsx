
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Services%20Photos%2FCommercial%20Roofing.avif?alt=media&token=a84e5e2d-66dd-4a2d-b147-9863bc451dfb",
    imageHint: "commercial building",
    title: "Commercial Roofing",
    description: "We provide quality commercial roofing services to protect your business.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    imageHint: "residential house",
    title: "Residential Roofing",
    description: "Protect your home and family with our expert residential roofing services.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1581351628313-1a71688527b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYXJtJTIwYnVpbGRpbmd8ZW58MHx8fHwxNzYyMjI0NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "farm building",
    title: "Industrial and Agricultural Roofing",
    description: "Durable and reliable roofing solutions for industrial and agricultural properties.",
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
