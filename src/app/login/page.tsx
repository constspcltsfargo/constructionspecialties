
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      // 1. Check for pre-coded credentials first
      if (email === 'admin@example.com' && password === 'password') {
          const adminUser = { uid: 'precoded-admin', email: 'admin@example.com', role: 'admin' };
          document.cookie = `mockSession=${JSON.stringify(adminUser)}; path=/; max-age=3600`;
          router.push('/admin');
          // No need to set isLoggingIn to false as we are navigating away
          return;
      }

      // 2. If not pre-coded, check Firestore
      if (!firestore) {
        setError('Firestore is not available.');
        setIsLoggingIn(false);
        return;
      }

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
      // Create a mock session cookie
      document.cookie = `mockSession=${JSON.stringify({ uid: userId, email: userData.email, role: userData.role })}; path=/; max-age=3600`;

      // Redirect to the admin page
      router.push('/admin');

    } catch (e: any) {
      setError(e.message || 'An error occurred during login.');
      console.error(e);
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
            <br />
            Use <b>admin@example.com</b> and <b>password</b> to log in.
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
                    required
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
                    required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoggingIn ? 'Please wait...' : 'Login'}
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
