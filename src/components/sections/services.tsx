import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Home, Shield, HardHat, Building, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: <Home className="h-10 w-10 text-primary" />,
    title: "Residential Roofing",
    description: "High-quality roofing systems to protect your home and enhance its curb appeal.",
  },
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: "Commercial Roofing",
    description: "Durable and efficient roofing solutions for commercial and industrial properties.",
  },
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: "Roof Repair",
    description: "Prompt and reliable repairs for leaks, storm damage, and wear to extend your roof's lifespan.",
  },
  {
    icon: <HardHat className="h-10 w-10 text-primary" />,
    title: "Siding",
    description: "Upgrade your home's exterior with our beautiful and long-lasting siding options.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Gutters",
    description: "Protect your property from water damage with our seamless gutter installations and repairs.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
    title: "Inspections",
    description: "Comprehensive roof inspections to identify potential issues before they become costly problems.",
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
            <Card key={index} className="flex flex-col text-center items-center p-6 hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary">
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
            <Button asChild size="lg" className="rounded-full">
                <Link href="#contact">Request a Free Consultation</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
