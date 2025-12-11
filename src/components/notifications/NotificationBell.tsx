
'use client';

import { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, X, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

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
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </div>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-2xl z-50"
          >
            <div className="p-3 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="link" size="sm" className="text-xs p-0 h-auto">
                  <CheckCheck className="w-3 h-3 mr-1"/>
                  Mark all as read
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-80">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <Link key={notif.id} href={notif.link || '#'} className="block" onClick={() => setOpen(false)}>
                      <div className={`p-3 border-b border-border hover:bg-muted transition-colors ${!notif.read ? 'bg-primary/10' : ''}`}>
                          <p className="font-semibold text-sm mb-1">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                              {formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
                          </p>
                      </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-10">No notifications yet.</p>
              )}
            </ScrollArea>
            
            <div className="p-2 text-center border-t border-border">
                <Button variant="link" size="sm" asChild>
                    <Link href="/dashboard/notifications">View all</Link>
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
