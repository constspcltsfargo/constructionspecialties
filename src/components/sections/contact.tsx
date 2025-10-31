import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Have a question or need a quote? Reach out to us. We're here to help.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
              <p className="text-muted-foreground mb-6">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">(123) 456-7890</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">contact@constructionspec.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">123 Construction Ave, Buildtown, USA</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
