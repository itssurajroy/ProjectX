
'use client';

import { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, CheckCheck, CircleDashed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    markAsRead(id);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-2xl z-50"
          >
            <div className="p-3 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <Button onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))} variant="link" size="sm" className="text-xs p-0 h-auto">
                  <CheckCheck className="w-3 h-3 mr-1"/>
                  Mark all as read
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-80">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <Link key={notif.id} href={notif.link || '#'} className="block" onClick={() => handleLinkClick(notif.id)}>
                      <div className={`p-3 border-b border-border/50 hover:bg-muted transition-colors ${!notif.read ? 'bg-primary/10' : ''}`}>
                          <p className="font-semibold text-sm mb-1">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                              {formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
                          </p>
                      </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <CircleDashed className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">You're all caught up.</p>
                </div>
              )}
            </ScrollArea>
            
            <div className="p-2 text-center border-t border-border">
                <Button variant="link" size="sm" asChild>
                    <Link href="/dashboard/notifications" onClick={() => setOpen(false)}>View all</Link>
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
