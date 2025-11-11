
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;
    
    let email = identifier;

    try {
      // If identifier is not an email, it could be a username.
      // We need to fetch the email associated with the username from Firestore.
      if (!identifier.includes('@') && firestore) {
          const usersCollection = collection(firestore, 'users');
          const userQuery = query(usersCollection, where('username', '==', identifier));
          const querySnapshot = await getDocs(userQuery);

          if (querySnapshot.empty) {
              throw new Error("Invalid username.");
          }
          const userDoc = querySnapshot.docs[0];
          email = userDoc.data().email;
      }

      await signInWithEmailAndPassword(auth, email, password);

      toast({ title: 'Login successful! Redirecting...' });
      router.push('/admin');

    } catch (err: any) {
        let errorMessage = 'An unexpected error occurred.';
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password.';
                break;
            default:
                errorMessage = err.message;
                break;
        }
        setError(errorMessage);
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
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Username</Label>
                    <Input
                      id="identifier"
                      name="identifier"
                      placeholder="m@example.com or username"
                      disabled={isLoggingIn}
                      required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      disabled={isLoggingIn}
                      required
                    />
                </div>
                 {error && (
                    <div className="text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoggingIn ? 'Please wait...' : 'Login'}
                </Button>
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign Up
                    </Link>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
