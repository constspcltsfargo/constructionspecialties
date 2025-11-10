'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AddUserDialog } from './_components/add-user-dialog';
import { EditUserDialog } from './_components/edit-user-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { deleteUser } from '../actions/users';

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
  const { data: session } = useSession();
  const { toast } = useToast();

  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isEditUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  // We need to refetch data after mutations
  const { data: users, isLoading, error, setData: setUsers } = useCollection<UserProfile>(usersCollectionRef);

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };
  
  const onUserAdded = (newUser: UserProfile) => {
    setUsers(currentUsers => [...(currentUsers || []), newUser]);
  }
  
  const onUserUpdated = (updatedUser: UserProfile) => {
    setUsers(currentUsers => (currentUsers || []).map(u => u.id === updatedUser.id ? updatedUser : u));
  }


  const handleDelete = async (userId: string) => {
    if (!firestore) return;
    setIsDeleting(userId);
    try {
        await deleteUser(userId);
        setUsers(currentUsers => (currentUsers || []).filter(u => u.id !== userId));
        toast({
            title: 'User Deleted',
            description: 'The user has been successfully deleted.',
        });
    } catch (e: any) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: 'Error Deleting User',
            description: e.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsDeleting(null);
    }
  };


  return (
     <>
        <AddUserDialog open={isAddUserOpen} onOpenChange={setAddUserOpen} onUserAdded={onUserAdded} />
        {selectedUser && <EditUserDialog user={selectedUser} open={isEditUserOpen} onOpenChange={setEditUserOpen} onUserUpdated={onUserUpdated} />}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button onClick={() => setAddUserOpen(true)}>
                    <Plus className="mr-2" />
                    Add User
                </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                                <Button variant="outline" size="icon" onClick={() => handleEditClick(user)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit User</span>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" disabled={isDeleting === user.id || user.id === session?.user?.id}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete User</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the user account.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(user.id)} disabled={isDeleting === user.id}>
                                                {isDeleting === user.id ? 'Deleting...' : 'Delete'}
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
            {users && users.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">No users found</h3>
                    <p className="text-muted-foreground mt-2">Use the "Add User" button to create the first user.</p>
                </div>
            )}
          </CardContent>
        </Card>
    </>
  );
}
