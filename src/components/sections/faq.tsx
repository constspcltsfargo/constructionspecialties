import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How often should I have my roof inspected?",
    answer: "We recommend having your roof inspected at least once a year, and also after any major storm, to catch potential issues early and prevent costly repairs.",
  },
  {
    question: "What are the signs that I might need a new roof?",
    answer: "Common signs include missing or curled shingles, granules in your gutters, visible leaks or water stains on your ceiling, and a roof that is over 20 years old.",
  },
  {
    question: "How long does a typical roof replacement take?",
    answer: "A typical residential roof replacement can usually be completed in 1 to 3 days, depending on the size and complexity of the roof, as well as weather conditions.",
  },
  {
    question: "Do you offer warranties on your work?",
    answer: "Yes, we offer robust warranties on both materials and workmanship to give you peace of mind. The specifics can vary depending on the materials and services you choose.",
  },
  {
    question: "Is financing available for my project?",
    answer: "Absolutely. We offer flexible financing options to help make your home improvement project more affordable. Contact us to learn more about the plans available.",
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
