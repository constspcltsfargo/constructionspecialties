import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons/logo";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo className="h-8 w-8 text-primary" />
                <p className="text-xl font-bold text-white">
                  Company Name
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Quality you can trust, service you can count on.</p>
              <div className="flex items-center gap-4 mt-6">
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </Link>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </Link>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </Link>
                 <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </Link>
                 <Link href="#" aria-label="YouTube">
                  <Youtube className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#services" className="text-muted-foreground hover:text-primary">Our Services</Link></li>
                <li><Link href="#why-us" className="text-muted-foreground hover:text-primary">Why Choose Us</Link></li>
                <li><Link href="#gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
                <li><Link href="#testimonials" className="text-muted-foreground hover:text-primary">Testimonials</Link></li>
                <li><Link href="#contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Roofing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Siding</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Gutters</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Windows</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Repairs</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold text-white mb-4">Contact Info</h4>
               <ul className="space-y-2 text-sm text-muted-foreground">
                 <li>123 Main Street, City, State 12345</li>
                 <li>(123) 456-7890</li>
                 <li>info@company.com</li>
               </ul>
            </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
