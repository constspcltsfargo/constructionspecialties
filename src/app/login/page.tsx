
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const firestore = useFirestore();
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    if (!firestore) {
      setError('Firestore is not available.');
      return;
    }

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this email.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // IMPORTANT: This is an insecure password check for prototyping only.
      // In a real application, you must hash passwords on a server.
      if (userData.password !== password) {
        setError('Incorrect password.');
        return;
      }
      
      // In a real app, you would set a session cookie here.
      // For now, we'll just redirect. The middleware will need to be updated.
      // We will set a simple cookie to simulate a session for the middleware.
      const userId = userDoc.id;
      document.cookie = `mockSession=${JSON.stringify({ uid: userId, email: userData.email, role: userData.role })}; path=/; max-age=3600`;

      router.push('/admin');

    } catch (e: any) {
      setError(e.message || 'An error occurred during login.');
      console.error(e);
    }
  };

  const handleSignUp = async () => {
     setError(null);
     alert("Sign-up is not implemented in this prototype. Please use the existing user credentials.");
     // In a real application, this would involve creating a new user document
     // in the 'users' collection with a securely hashed password.
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
         <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the admin dashboard.
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleLogin} className="w-full">
                  Login
                </Button>
              </CardContent>
            </TabsContent>
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Sign-up is disabled for this prototype.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    disabled
                  />
                </div>
                <Button onClick={handleSignUp} className="w-full" disabled>
                  Sign Up
                </Button>
              </CardContent>
            </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
