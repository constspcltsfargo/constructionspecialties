
'use client';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
    displayName: string;
    email: string;
    photoURL?: string;
    role?: string;
}

export default function UserManagementPage() {
  const firestore = useFirestore();
  const usersCollectionRef = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<UserProfile>(usersCollectionRef);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
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
                                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
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
    </div>
  );
}
