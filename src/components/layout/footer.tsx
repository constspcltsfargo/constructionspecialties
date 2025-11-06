
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <Image 
                    src="https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/CS%20LLC%20New%20logo%20PNG.png?alt=media&token=c1de30c8-b019-4f96-bcbc-14371b3c3dd2"
                    alt="Construction Specialties, LLC Logo"
                    width={200}
                    height={66}
                    className="h-20 w-auto invert brightness-0"
                 />
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
                <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
                <li><Link href="#contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Residential Roofing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Commercial Roofing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Storm Damage</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold text-white mb-4">Contact Info</h4>
               <ul className="space-y-2 text-sm text-muted-foreground">
                 <li>405 11th Ave NW<br/>West Fargo, ND 58078</li>
                 <li>constspcltsfargo@gmail.com</li>
                 <li className="mt-2"><b>Fargo:</b> 701-277-1633</li>
                 <li><b>Minot:</b> 701-852-1633</li>
               </ul>
            </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Construction Specialties & Roofing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

    

    

    
