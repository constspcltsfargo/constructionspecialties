import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            We're ready to help with your next project. Reach out to us today!
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8 bg-background p-8 rounded-lg shadow-lg">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Get In Touch</h3>
              <p className="text-muted-foreground mb-6">
                Use the form to send us a message, or contact us directly using the information below. We look forward to hearing from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:1234567890" className="text-muted-foreground hover:text-primary">(123) 456-7890</a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:info@company.com" className="text-muted-foreground hover:text-primary">info@company.com</a>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <span className="text-muted-foreground">123 Main Street<br/>Anytown, USA 12345</span>
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
