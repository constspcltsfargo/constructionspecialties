'use client';

import { useState } from 'react';
import { useAuth, useFirestore, errorEmitter } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc }from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FirestorePermissionError } from '@/firebase/errors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const handleAuth = async (isSignUp: boolean) => {
    setError(null);
    if (!auth || !firestore) {
      setError('Authentication services are not available.');
      return;
    }
    try {
      const userCredential = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      if (isSignUp) {
        const user = userCredential.user;
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        const roleData = { role: 'admin' };
        
        // Non-blocking write with custom error handling
        setDoc(adminRoleRef, roleData)
          .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: adminRoleRef.path,
              operation: 'create',
              requestResourceData: roleData,
            });
            errorEmitter.emit('permission-error', permissionError);
            // We can also set a user-facing error if needed, but the listener will throw for dev
            setError('Failed to set admin role due to permissions.');
          });
      }
      
      // Optimistically navigate
      router.push('/admin');

    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
      console.error(e);
    }
  };

  const handleAnonymousAuth = async () => {
    setError(null);
    if (!auth || !firestore) {
      setError('Authentication services are not available.');
      return;
    }
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      const roleData = { role: 'admin' };
      
      // Non-blocking write with custom error handling
      setDoc(adminRoleRef, roleData)
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: adminRoleref.path,
            operation: 'create',
            requestResourceData: roleData,
          });
          errorEmitter.emit('permission-error', permissionError);
          setError('Failed to set admin role due to permissions.');
        });
        
      router.push('/admin');

    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
      console.error(e);
    }
  };

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
                <Button onClick={() => handleAuth(false)} className="w-full">
                  Login
                </Button>
              </CardContent>
            </TabsContent>
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create an account to get started. The first user will become an admin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={() => handleAuth(true)} className="w-full">
                  Sign Up
                </Button>
              </CardContent>
            </TabsContent>
        </Tabs>
        <div className="px-6 pb-6">
            <div className="relative">
                <Separator />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-background px-2 text-sm text-muted-foreground">
                        OR
                    </span>
                </div>
            </div>
            <Button variant="outline" onClick={handleAnonymousAuth} className="w-full mt-4">
                Sign in Anonymously
            </Button>
        </div>
      </Card>
    </div>
  );
}
