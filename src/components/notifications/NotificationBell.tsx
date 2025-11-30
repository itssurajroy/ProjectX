
'use client';

import { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full bg-card hover:bg-muted"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 block h-2.5 w-2.5 transform rounded-full bg-gradient-to-br from-red-500 to-pink-600 ring-2 ring-background"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute right-0 mt-3 w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-sm text-primary hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground">No notifications yet</p>
                ) : (
                  notifications.map(notif => (
                    <Link href={notif.link || '#'} key={notif.id} className="block" onClick={() => setOpen(false)}>
                      <div className={`p-4 border-b border-border last:border-b-0 hover:bg-muted transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0">
                            {notif.icon || '★'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{notif.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                            {notif.createdAt && (
                                <p className="text-xs text-muted-foreground/70 mt-2">
                                    {new Date(notif.createdAt.seconds * 1000).toLocaleString()}
                                </p>
                            )}
                          </div>
                          {!notif.read && (
                            <div className="w-2.5 h-2.5 mt-1 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
