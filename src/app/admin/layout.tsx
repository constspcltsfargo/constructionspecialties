
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
import { Home, Users, FileText, Mailbox, ImageIcon, LogOut, GalleryHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
