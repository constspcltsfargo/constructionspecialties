import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of roofing do you install?",
    answer: "We install a variety of roofing materials, including asphalt shingles, metal roofing, tile roofing, and flat roofing systems. We can help you choose the best option for your home and budget.",
  },
  {
    question: "How long will my new roof last?",
    answer: "The lifespan of your roof will depend on the materials used. Asphalt shingle roofs typically last 20-30 years, while metal and tile roofs can last 50 years or more with proper maintenance.",
  },
  {
    question: "Do you offer financing options?",
    answer: "Yes, we offer flexible financing options to help make your new roof more affordable. We can discuss the available plans during your free consultation.",
  },
  {
    question: "Are you licensed and insured?",
    answer: "Yes, we are a fully licensed and insured roofing contractor in the state of Florida. Our license number is [State License Number].",
  },
  {
    question: "How do I know if I need a roof repair or replacement?",
    answer: "Our team can provide a free roof inspection to assess the condition of your roof and recommend the best course of action. Signs you may need a repair or replacement include leaks, missing or damaged shingles, and visible wear and tear.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-12 md:py-24 bg-secondary">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Find answers to common questions about our services and processes.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
