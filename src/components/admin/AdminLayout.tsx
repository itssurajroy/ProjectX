'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  PenSquare,
  Clock,
  ShieldAlert,
  Megaphone,
  Settings,
  Trash2,
  ListTodo,
  ScrollText,
  Tags,
  Share2,
  Gavel,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { initializeFirebase } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const { firestore } = initializeFirebase();

function AdminSidebar() {
  const pathname = usePathname();
  const [reportCount, setReportCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    // Real-time listener for active reports
    const reportsRef = collection(firestore, 'admin', 'reports', 'active');
    const unsubReports = onSnapshot(reportsRef, (snap) => {
      setReportCount(snap.size);
    }, () => {}); // Add empty error handler

    // Real-time listener for pending requests
    const requestsRef = collection(firestore, 'admin', 'requests', 'pending');
    const unsubRequests = onSnapshot(requestsRef, (snap) => {
      setRequestCount(snap.size);
    }, () => {}); // Add empty error handler


    return () => {
      unsubReports();
      unsubRequests();
    };
  }, []);

  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/moderation', label: 'Moderation', icon: Gavel, badge: reportCount },
    { href: '/admin/overrides', label: 'Overrides', icon: PenSquare },
    { href: '/admin/skiptimes', label: 'Skiptimes', icon: Clock },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/requests', label: 'Requests', icon: ListTodo, badge: requestCount },
    { href: '/admin/socials', label: 'Socials', icon: Share2 },
    { href: '/admin/cache', label: 'Cache', icon: Trash2 },
    { href: '/admin/seo', label: 'SEO', icon: Tags },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/logs', label: 'Logs', icon: ScrollText },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2">
           <Link href="/" className="text-2xl font-bold text-glow">
            <span className="text-primary">Project</span>
            <span className="text-white">X</span>
          </Link>
          <Badge variant="destructive">Admin</Badge>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                  className="w-full justify-start"
                  icon={<item.icon />}
                  label={item.label}
                >
                  <Link href={item.href}>
                     {item.badge && item.badge > 0 ? (
                        <Badge className="ml-auto">{item.badge}</Badge>
                      ): null}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarHeader className="border-t">
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
                <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=admin`} />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@example.com</span>
            </div>
        </div>
      </SidebarHeader>
    </Sidebar>
  );
}


function AdminPanelContainer({ children }: { children: ReactNode }) {
    const { isExpanded, isMobile } = useSidebar();
    const pathname = usePathname();
    const getPageTitle = (path: string) => {
        if (path === '/admin') return 'Dashboard';
        const segment = path.split('/').pop()?.replace('-', ' ');
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Admin';
    }

    return (
        <div className={cn(
            'transition-all duration-300 ease-in-out', 
            !isMobile && (isExpanded ? 'pl-64' : 'pl-[3.35rem]'),
            isMobile && 'pl-0'
        )}>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
                <SidebarTrigger className="md:hidden"/>
                <h1 className="text-lg font-semibold capitalize">{getPageTitle(pathname)}</h1>
            </header>
            <main className="p-4 sm:p-6">{children}</main>
        </div>
    )
}

export function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen">
        <AdminSidebar />
        <AdminPanelContainer>
          {children}
        </AdminPanelContainer>
      </div>
    </SidebarProvider>
  );
}
