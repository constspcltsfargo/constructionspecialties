
'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface Page {
    id: string;
    title: string;
    slug: string;
    lastUpdated: string;
}

export default function PageManagementPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const pagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pages');
  }, [firestore]);

  const { data: pages, isLoading, error } = useCollection<Page>(pagesCollectionRef);

  const handleDelete = async (pageId: string) => {
    if (!firestore) return;
    setIsDeleting(true);
    try {
      const pageDocRef = doc(firestore, 'pages', pageId);
      await deleteDoc(pageDocRef);
      toast({
        title: 'Success!',
        description: 'Page deleted successfully.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting page',
        description: err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Separate the homepage from other pages
  const otherPages = pages?.filter(page => page.id !== 'home');
  const homePage = pages?.find(page => page.id === 'home');


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

        {homePage && (
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Homepage</h3>
                <div className="p-4 border rounded-lg flex justify-between items-center bg-secondary">
                    <div>
                        <p className="font-medium">{homePage.title}</p>
                        <p className="text-sm text-muted-foreground">Last updated: {homePage.lastUpdated ? new Date(homePage.lastUpdated).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/pages/home">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Homepage Sections
                        </Link>
                    </Button>
                </div>
                 <Separator className="my-8" />
            </div>
        )}

        {otherPages && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherPages.map(page => (
                <TableRow key={page.id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>/{page.slug}</TableCell>
                  <TableCell>{page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/pages/${page.id}`}>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {otherPages && otherPages.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No other pages found</h3>
                <p className="text-muted-foreground mt-2">Get started by creating a new page.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
