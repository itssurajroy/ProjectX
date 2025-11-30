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
  Badge as BadgeIcon,
  Tags,
  Share2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/overrides', label: 'Overrides', icon: PenSquare },
  { href: '/admin/skiptimes', label: 'Skiptimes', icon: Clock },
  { href: '/admin/reports', label: 'Reports', icon: ShieldAlert, badge: 17 },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/requests', label: 'Requests', icon: ListTodo, badge: 5 },
  { href: '/admin/socials', label: 'Socials', icon: Share2 },
  { href: '/admin/cache', label: 'Cache', icon: Trash2 },
  { href: '/admin/seo', label: 'SEO', icon: Tags },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

function AdminSidebar() {
  const pathname = usePathname();

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
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')}
                  className="w-full justify-start"
                  icon={<item.icon />}
                  label={item.label}
                >
                  <Link href={item.href}>
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

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard';
    const segment = path.split('/').pop()?.replace('-', ' ');
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Admin';
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="md:peer-data-[state=expanded]:peer-data-[variant=inset]:ml-[16rem] peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-[3rem]">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
            <SidebarTrigger className="md:hidden"/>
            <h1 className="text-lg font-semibold capitalize">{getPageTitle(pathname)}</h1>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
