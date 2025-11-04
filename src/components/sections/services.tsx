
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Building, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: <Home className="h-10 w-10 text-primary" />,
    title: "Residential Roofing",
    description: "Protect your home and family with our expert residential roofing services.",
  },
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: "Commercial Roofing",
    description: "We provide quality commercial roofing services to protect your business.",
  },
  {
    icon: <Wind className="h-10 w-10 text-primary" />,
    title: "Storm Damage",
    description: "Our team is ready to help you with your storm damage needs.",
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
            <Card key={index} className="flex flex-col text-center items-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                {service.icon}
              </CardHeader>
              <CardContent className="p-0 mt-4 flex-1">
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
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
