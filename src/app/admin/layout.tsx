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
import { Home, Users, Mailbox, GalleryHorizontal, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase'; // Import the new useUser hook
import { useEffect } from 'react';

function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        // For a custom auth system, we redirect to login, which should clear any session state.
        router.push('/login');
    };

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
                                  Estimates
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
                          <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/media')}>
                             <Link href="/admin/media">
                                  <GalleryHorizontal />
                                  <span>Gallery</span>
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


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // While loading, show a full-screen loader.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there's a user, render the protected admin layout.
  if (user) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
  }

  // If no user and not loading (i.e. about to redirect), render nothing to prevent content flash.
  return null;
}
