
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as firestore from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server-init';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    // 1. Check for pre-coded admin credentials
    if (email === 'admin@example.com' && password === 'password') {
      const adminUser = { uid: 'pre-coded-admin', email: 'admin@example.com', role: 'admin' };
      document.cookie = `mockSession=${JSON.stringify(adminUser)}; path=/; max-age=3600`;
      router.push('/admin');
      return;
    }

    // 2. If not admin, check Firestore for a matching user
    try {
      const { firestore: db } = initializeFirebase();
      const usersRef = firestore.collection(db, 'users');
      const q = firestore.query(usersRef, firestore.where('email', '==', email));
      const querySnapshot = await firestore.getDocs(q);

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
      
      const user = { uid: userDoc.id, email: userData.email, role: userData.role || 'user' };
      document.cookie = `mockSession=${JSON.stringify(user)}; path=/; max-age=3600`;
      router.push('/admin');

    } catch (err: any) {
      console.error('Firestore login error:', err);
      setError(err.message || 'An error occurred during login.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoggingIn}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoggingIn}
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoggingIn ? 'Please wait...' : 'Login'}
                </Button>
            </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                    Sign Up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
