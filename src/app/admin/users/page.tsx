
'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';


export interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    photoURL?: string;
    role?: 'user' | 'admin';
}

export default function UserManagementPage() {
  const firestore = useFirestore();

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<UserProfile>(usersCollectionRef);

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/users`;


  return (
     <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Manage Users in Firebase</AlertTitle>
          <AlertDescription>
            For security and reliability, please manage all users (add, edit, delete) directly in the Firebase Console.
            <Button variant="link" asChild className="p-0 h-auto ml-2">
              <Link href={consoleUrl} target="_blank" rel="noopener noreferrer">
                Open Firebase Authentication
              </Link>
            </Button>
          </AlertDescription>
        </Alert>

        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {users && (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.photoURL} alt={user.name} />
                                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                {user.role || 'user'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                             <Button variant="outline" size="icon" disabled>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit User</span>
                             </Button>
                             <Button variant="destructive" size="icon" disabled>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete User</span>
                             </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        )}
         {users && users.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No users found</h3>
                <p className="text-muted-foreground mt-2">Users will appear here once they are added in the Firebase Console.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
