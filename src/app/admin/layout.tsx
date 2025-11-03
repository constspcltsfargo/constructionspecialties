
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
} from '@/components/ui/sidebar';
import { Home, Users, FileText, LayoutTemplate, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
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
                        <SidebarMenuButton asChild isActive={pathname === '/admin/users'}>
                           <Link href="/admin/users">
                                <Users />
                                <span>Users</span>
                           </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <Collapsible asChild>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className="justify-between"
                              isActive={pathname.startsWith('/admin/pages')}
                            >
                                <div className='flex items-center gap-2'>
                                  <FileText />
                                  <span>Pages</span>
                                </div>
                                <ChevronDown
                                  className={cn(
                                    "transition-transform",
                                    "group-data-[state=open]:-rotate-180"
                                  )}
                                />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-1 py-1 pl-8">
                                <SidebarMenuButton asChild variant="ghost" size="sm" className="w-full justify-start" isActive={pathname === '/admin/pages'}>
                                   <Link href="/admin/pages">All Pages</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild variant="ghost" size="sm" className="w-full justify-start" isActive={pathname === '/admin/pages/home'}>
                                   <Link href="/admin/pages/home">Homepage</Link>
                                </SidebarMenuButton>
                            </div>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <div className="p-4">
                 {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
