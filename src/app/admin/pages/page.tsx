
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface Page {
    id: string;
    title: string;
    slug: string;
    lastUpdated: string;
}

export default function PageManagementPage() {
  const firestore = useFirestore();

  const pagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pages');
  }, [firestore]);

  const { data: pages, isLoading, error } = useCollection<Page>(pagesCollectionRef);

  // Filter out the special 'home' page from the list
  const filteredPages = pages?.filter(page => page.id !== 'home');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pages</CardTitle>
          <Button asChild>
            <Link href="/admin/pages/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Page
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading pages...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {filteredPages && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map(page => (
                <TableRow key={page.id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>/{page.slug}</TableCell>
                  <TableCell>{page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/pages/${page.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {filteredPages && filteredPages.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No pages found</h3>
                <p className="text-muted-foreground mt-2">Get started by creating a new page.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
