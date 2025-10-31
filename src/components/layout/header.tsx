"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/icons/logo";

const navLinks = [
  { href: "#services", label: "Our Services" },
  { href: "#why-us", label: "Why Choose Us" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md' : 'bg-white/30 backdrop-blur-md'}`}>
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className={`h-8 w-8 transition-colors text-primary`} />
            <span className={`font-bold text-lg transition-colors sm:inline-block text-foreground`}>
              Company Name
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${isScrolled ? 'text-foreground/80' : 'text-foreground/80 hover:text-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button
            asChild
            className={`hidden lg:inline-flex rounded-full transition-colors ${isScrolled ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
          >
            <Link href="#contact">Free Estimate</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`lg:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-background">
              <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setOpen(false)}>
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold">Company Name</span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                   <Link
                      href={"#contact"}
                      onClick={() => setOpen(false)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Contact Us
                    </Link>
                </div>
              </div>
               <div className="pl-6">
                 <Button asChild className="w-full rounded-full">
                    <Link href="#contact" onClick={() => setOpen(false)}>Free Estimate</Link>
                 </Button>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
