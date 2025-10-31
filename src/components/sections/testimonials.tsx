import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah L.",
    location: "Springfield",
    avatarId: "testimonial-avatar-1",
    quote: "The team at Construction Specialties was fantastic. They replaced our roof ahead of schedule and the quality is outstanding. Highly recommended for jejich professionalism and efficiency!",
  },
  {
    name: "Michael B.",
    location: "Rivertown",
    avatarId: "testimonial-avatar-2",
    quote: "I was impressed with their attention to detail. They took the time to explain everything and the final result exceeded our expectations. Our new siding looks amazing.",
  },
  {
    name: "Jessica P.",
    location: "Oakville",
    avatarId: "testimonial-avatar-3",
    quote: "From the initial quote to the final cleanup, the entire process was smooth and professional. It's rare to find a company that truly cares about their customers.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Real stories from homeowners who trusted us with their projects.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => {
              const avatar = PlaceHolderImages.find((img) => img.id === testimonial.avatarId);
              return (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between h-full">
                      <CardContent className="pt-6">
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                      </CardContent>
                      <div className="flex items-center p-6 bg-muted/50">
                        <Avatar className="h-12 w-12 mr-4">
                          {avatar && <AvatarImage src={avatar.imageUrl} alt={testimonial.name} data-ai-hint={avatar.imageHint} />}
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
