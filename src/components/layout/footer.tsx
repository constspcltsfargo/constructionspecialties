import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons/logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Construction Specialties. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
