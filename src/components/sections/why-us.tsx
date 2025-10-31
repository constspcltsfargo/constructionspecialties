import { Award, ShieldCheck, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "10+ Years of Experience",
    description: "Our seasoned team brings a decade of expertise to every project, ensuring top-quality results.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Licensed & Insured",
    description: "We are fully licensed and insured, providing you with peace of mind and protection.",
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "5-Star Customer Ratings",
    description: "Our commitment to excellence is reflected in the glowing reviews from our satisfied clients.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Dedicated Support Team",
    description: "A friendly and knowledgeable team ready to assist you at every stage of your project.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Construction Specialties?</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            We're not just builders; we're your partners in creating a safe and beautiful home. Here’s why homeowners trust us.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
