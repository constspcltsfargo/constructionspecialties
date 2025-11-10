
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ensureAdminUser } from '@/app/admin/users/actions';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    async function prepareAdmin() {
      setIsPreparing(true);
      try {
        const result = await ensureAdminUser();
        if (!result.success) {
            setError(`Failed to prepare admin account: ${result.message}`);
        }
      } catch (e: any) {
        setError(`An unexpected error occurred: ${e.message}`);
      } finally {
        setIsPreparing(false);
      }
    }
    prepareAdmin();
  }, []);

  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);

    // Check for special pre-coded credentials first
    if (email === 'admin@example.com' && password === 'password') {
        const adminUser = { uid: 'precoded-admin', email: 'admin@example.com', role: 'admin' };
        document.cookie = `mockSession=${JSON.stringify(adminUser)}; path=/; max-age=3600`;
        router.push('/admin');
        return; 
    }

    if (!firestore) {
      setError('Firestore is not available.');
      setIsLoggingIn(false);
      return;
    }

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this email.');
        setIsLoggingIn(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      if (userData.password !== password) {
        setError('Incorrect password.');
        setIsLoggingIn(false);
        return;
      }
      
      const userId = userDoc.id;
      document.cookie = `mockSession=${JSON.stringify({ uid: userId, email: userData.email, role: userData.role })}; path=/; max-age=3600`;

      router.push('/admin');

    } catch (e: any) {
      setError(e.message || 'An error occurred during login.');
      console.error(e);
      setIsLoggingIn(false);
    }
  };
  
  const isLoading = isLoggingIn || isPreparing;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard.
            <br />
            Use <b>admin@example.com</b> and <b>password</b> to log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {isPreparing ? (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Preparing admin account...</span>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                        {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                    </Button>
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
