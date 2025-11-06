
'use client';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Cta } from "@/components/sections/cta";
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
  gallery: Gallery,
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

  const sortedElements = useMemo(() => {
    if (!pageElements) return [];
    // The query should already order them, but an extra sort doesn't hurt.
    return [...pageElements].sort((a, b) => a.order - b.order);
  }, [pageElements]);


  if (isLoading || !pageElements || pageElements.length === 0) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Skeleton className="h-[600px] w-full" />
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
        {sortedElements.map(element => {
          const Component = componentMap[element.type];
          if (!Component) {
            return null; // Don't render unknown sections
          }
          // Pass content to components that need it
          return <Component key={element.id} content={element.content} />;
        })}
      </main>
      <Footer />
    </div>
  );
}

