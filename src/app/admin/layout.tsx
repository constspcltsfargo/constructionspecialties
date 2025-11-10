
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Users, FileText, Mailbox, ImageIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const auth = useAuth();
    const { user, isUserLoading } = useUser();

    useEffect(() => {
        // If loading is finished and there's no user, redirect to login
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);


    const handleSignOut = async () => {
      try {
        if (auth) {
            await signOut(auth);
        }
        // Redirecting to login will be handled by the effect hook above
        router.push('/login');
      } catch (error) {
        console.error("Sign out error", error);
      }
    };

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="space-y-4 text-center">
                <p className="text-muted-foreground">Authenticating...</p>
                 <div className="flex items-center justify-center h-screen">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary animate-spin">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                           <Link href="/admin">
                                <Home />
                                <span>Dashboard</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/estimates'}>
                           <Link href="/admin/estimates">
                                <Mailbox />
                                <span>Estimates</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/users'}>
                           <Link href="/admin/users">
                                <Users />
                                <span>Users</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/pages')}>
                           <Link href="/admin/pages">
                                <FileText />
                                <span>Pages</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/media')}>
                           <Link href="/admin/media">
                                <ImageIcon />
                                <span>Media</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleSignOut}>
                            <LogOut />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
                 {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
