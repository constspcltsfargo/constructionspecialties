import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="bg-accent text-accent-foreground py-12 md:py-20">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
          Ready for a Stronger, Safer Roof?
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Don't wait for a small problem to become a major expense. Schedule your free, no-obligation roof inspection with our experts today.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="#contact">Schedule Free Inspection</Link>
        </Button>
      </div>
    </section>
  );
}
