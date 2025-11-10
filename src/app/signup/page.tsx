
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { handleSignUp, type FormState } from '@/app/auth/actions';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Creating Account...' : 'Sign Up'}
    </Button>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(handleSignUp, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith('Error:')) {
        toast({
          title: 'Error',
          description: state.issues ? state.issues.join(', ') : 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } else if (state.message.startsWith('Success')) {
        toast({
          title: 'Success!',
          description: 'Your account has been created. Redirecting to login...',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    }
  }, [state, toast, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Enter your details to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={state.fields?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={state.fields?.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={state.fields?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            {state.message.startsWith('Error:') && state.issues && (
              <div className="text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p>{state.issues.join(', ')}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
