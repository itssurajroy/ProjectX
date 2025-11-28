
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
  Badge,
  Tags,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/overrides', label: 'Overrides', icon: PenSquare },
  { href: '/admin/skiptimes', label: 'Skiptimes', icon: Clock },
  { href: '/admin/reports', label: 'Reports', icon: ShieldAlert, badge: 17 },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/requests', label: 'Requests', icon: ListTodo, badge: 5 },
  { href: '/admin/cache', label: 'Cache', icon: Trash2 },
  { href: '/admin/seo', label: 'SEO', icon: Tags },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

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
                  isActive={pathname === item.href}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto">{item.badge}</Badge>
                    )}
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
                <AvatarImage src={user?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.uid}`} />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.displayName || "Admin User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
        </div>
      </SidebarHeader>
    </Sidebar>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="md:peer-data-[state=expanded]:peer-data-[variant=inset]:ml-[16rem] peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-[3rem]">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
            <SidebarTrigger className="md:hidden"/>
            <h1 className="text-lg font-semibold capitalize">{title}</h1>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
