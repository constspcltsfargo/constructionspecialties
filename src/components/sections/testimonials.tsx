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
    quote: "The team was professional, efficient, and the results are fantastic. Our new roof looks amazing and we couldn't be happier with the service provided. Highly recommend!",
  },
  {
    name: "Michael B.",
    location: "Rivertown",
    avatarId: "testimonial-avatar-2",
    quote: "From the initial consultation to the final cleanup, their attention to detail was impeccable. They addressed all our concerns and delivered a flawless project on time.",
  },
  {
    name: "Jessica P.",
    location: "Oakville",
    avatarId: "testimonial-avatar-3",
    quote: "I was so impressed with the professionalism and craftsmanship. They transformed our home's exterior. It's refreshing to work with a company that genuinely cares.",
  },
  {
    name: "David H.",
    location: "Maple Creek",
    avatarId: "testimonial-avatar-1",
    quote: "Exceptional service and quality work. They handled our complex commercial roofing project with ease and expertise. We will definitely be using them again for future needs.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Honest feedback from homeowners and businesses we've had the pleasure to work with.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => {
              const avatar = PlaceHolderImages.find((img) => img.id === testimonial.avatarId);
              return (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4 h-full">
                    <Card className="flex flex-col justify-between h-full p-6 shadow-lg">
                      <CardContent className="p-0">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                      </CardContent>
                      <div className="flex items-center">
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
