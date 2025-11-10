
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    if (!firestore) {
      setError('Firestore is not available.');
      setIsLoading(false);
      return;
    }

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this email.');
        setIsLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // IMPORTANT: This is an insecure password check for prototyping only.
      // In a real application, you must hash passwords on a server.
      if (userData.password !== password) {
        setError('Incorrect password.');
        setIsLoading(false);
        return;
      }
      
      const userId = userDoc.id;
      // Set a mock session cookie. In a real app, this would be a secure, HTTP-only session token.
      document.cookie = `mockSession=${JSON.stringify({ uid: userId, email: userData.email, role: userData.role })}; path=/; max-age=3600`;

      // Redirect to the admin dashboard on successful login
      router.push('/admin');

    } catch (e: any) {
      setError(e.message || 'An error occurred during login.');
      console.error(e);
      setIsLoading(false);
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
            Use <b>admin@example.com</b> and <b>password</b> for the first login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
