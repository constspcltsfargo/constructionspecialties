import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="bg-primary text-primary-foreground py-12 md:py-20">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/90">
          Contact us today for a free, no-obligation estimate and let's turn your vision into reality.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="#contact">Get Your Free Estimate</Link>
        </Button>
      </div>
    </section>
  );
}
