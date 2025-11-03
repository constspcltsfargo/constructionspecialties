'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isUserLoading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {user && <Button onClick={handleSignOut}>Log Out</Button>}
      </div>
      <p>Welcome, {user ? user.email : 'Admin'}! This is your admin dashboard. You can manage pages and media from here.</p>
      {/* CMS and media upload components will go here */}
    </div>
  );
}
