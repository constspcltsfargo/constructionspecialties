import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Home, Shield, HardHat, Building, CheckCircle } from "lucide-react";

const services = [
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: "Roof Replacement",
    description: "Complete roof overhauls with high-quality materials for long-lasting protection.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Roof Repair",
    description: "Expert repairs for leaks, damage, and wear to extend the life of your roof.",
  },
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "Commercial Roofing",
    description: "Specialized roofing solutions for businesses and commercial properties of all sizes.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Gutter Installation",
    description: "Seamless gutter systems to protect your foundation and landscaping from water damage.",
  },
  {
    icon: <HardHat className="h-8 w-8 text-primary" />,
    title: "Siding Services",
    description: "Durable and beautiful siding options to enhance your home's curb appeal and insulation.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Roof Inspection",
    description: "Thorough inspections to assess roof health and identify potential issues early.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Premier Services</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            From minor repairs to major installations, we provide a wide range of services to meet your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                {service.icon}
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
