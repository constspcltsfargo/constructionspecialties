
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

// Define a map for component rendering
const componentMap: { [key: string]: React.ComponentType<any> } = {
  hero: Hero,
  services: Services,
  'why-us': WhyUs,
  gallery: Gallery,
  testimonials: Testimonials,
  faq: Faq,
  cta: Cta,
  contact: Contact,
};

export default function Home() {
  const firestore = useFirestore();
  
  const elementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'pages', 'home', 'pageElements'), orderBy('order'));
  }, [firestore]);

  const { data: pageElements, isLoading } = useCollection<any>(elementsQuery);

  const contentBySection = useMemo(() => {
    if (!pageElements) return {};
    return pageElements.reduce((acc, el) => {
      acc[el.type] = el.content;
      return acc;
    }, {} as { [key: string]: any });
  }, [pageElements]);


  if (isLoading || !pageElements || pageElements.length === 0) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Skeleton className="h-[500px] w-full" />
                <Skeleton className="h-[500px] w-full mt-4" />
                <Skeleton className="h-[500px] w-full mt-4" />
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {pageElements.map(element => {
          const Component = componentMap[element.type];
          if (!Component) {
            return <div key={element.id}>Unknown section type: {element.type}</div>;
          }
          // Pass content to components that need it
          const props = contentBySection[element.type] ? { content: contentBySection[element.type] } : {};
          return <Component key={element.id} {...props} />;
        })}
      </main>
      <Footer />
    </div>
  );
}
