
'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddUserDialog } from './_components/add-user-dialog';

interface UserProfile {
    displayName: string;
    email: string;
    photoURL?: string;
    role?: string;
}

export default function UserManagementPage() {
  const firestore = useFirestore();
  const [isAddUserOpen, setAddUserOpen] = useState(false);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<UserProfile>(usersCollectionRef);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
        </Button>
      </div>
      
      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {users && (
         <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                <TableRow key={user.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.photoURL} alt={user.displayName} />
                                <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.displayName}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role || 'user'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        {/* Actions buttons will go here */}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      )}
      <AddUserDialog isOpen={isAddUserOpen} onOpenChange={setAddUserOpen} />
    </div>
  );
}
