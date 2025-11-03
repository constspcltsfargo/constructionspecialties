
'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface PageData {
  id: string;
  title: string;
  content: string;
}

export default function DynamicPage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'pages'), where('slug', '==', params.slug));
  }, [firestore, params.slug]);

  useEffect(() => {
    const fetchPage = async () => {
      if (!pagesQuery) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(pagesQuery);
        if (querySnapshot.empty) {
          setError('Page not found.');
        } else {
          const doc = querySnapshot.docs[0];
          setPageData({ id: doc.id, ...doc.data() } as PageData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pagesQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {pageData && (
            <article className="prose lg:prose-xl mx-auto">
              <h1>{pageData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </article>
          )}
           {!loading && !pageData && !error && (
            <div className="text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-lg text-muted-foreground">Page not found</p>
            </div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
