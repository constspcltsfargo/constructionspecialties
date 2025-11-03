
'use client';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { WhyUs } from "@/components/sections/why-us";
import { Testimonials } from "@/components/sections/testimonials";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";

export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    features: string[];
  };
}

export default function Home() {
  const firestore = useFirestore();
  const homePageRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'pages', 'home');
  }, [firestore]);

  const { data: pageData, isLoading } = useDoc<HomepageContent>(homePageRef);

  const defaultContent: HomepageContent = {
    hero: {
      title: "Your Trusted Orlando <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800\">Roofing Company.</span>",
      subtitle: "Providing quality roof services to Central Florida homeowners and businesses since 2003. We are a local, family-owned roofing company dedicated to providing our customers with the best roofing services possible."
    },
    whyUs: {
        title: "Why Choose Us for Your Next Project?",
        subtitle: "We are a local, family-owned roofing company that has been serving Central Florida since 2003. We are dedicated to providing our customers with the best roofing services possible.",
        features: [
            "20+ Years of Experience",
            "Licensed & Insured",
            "Financing Available",
            "Locally Owned & Operated",
            "Certified Installers",
            "Quality Materials",
        ]
    }
  };

  const content = pageData || defaultContent;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {isLoading ? <Skeleton className="h-[500px] w-full" /> : <Hero content={content.hero} />}
        <Services />
        {isLoading ? <Skeleton className="h-[500px] w-full" /> : <WhyUs content={content.whyUs} />}
        <Gallery />
        <Testimonials />
        <Faq />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
