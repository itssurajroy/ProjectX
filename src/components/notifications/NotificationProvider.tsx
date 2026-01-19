
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { useCollection, useUser } from '@/firebase';
import { AppNotification } from '@/lib/types/notification';
import { BellRing } from 'lucide-react';

export type UINotification = AppNotification & { read: boolean };

interface NotificationContextType {
  notifications: UINotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const READ_NOTIFICATIONS_KEY = 'projectx-read-notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { data: rawNotifications, loading } = useCollection<AppNotification>('notifications');
  
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Load read IDs from localStorage on mount
  useEffect(() => {
    try {
      const storedReadIds = localStorage.getItem(READ_NOTIFICATIONS_KEY);
      if (storedReadIds) {
        setReadIds(new Set(JSON.parse(storedReadIds)));
      }
    } catch (e) {
      console.error("Failed to parse read notifications from localStorage", e);
    }
  }, []);

  // Process raw notifications and handle new ones
  useEffect(() => {
    if (!rawNotifications) return;

    const sorted = [...rawNotifications].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

    const newNotifications = sorted.map(n => ({
      ...n,
      read: readIds.has(n.id),
    }));

    // Identify new, unread notifications to show a toast
    if (!loading && newNotifications.length > 0) {
        newNotifications.forEach(n => {
            if (!readIds.has(n.id)) {
                // This is a new notification for this user
                toast(n.title, {
                    description: n.message,
                    icon: <BellRing className="w-5 h-5" />,
                    action: n.link ? {
                        label: "View",
                        onClick: () => { /* will navigate via link wrapper */ }
                    } : undefined,
                });
                // Immediately mark as read to prevent re-toasting on next render
                markAsRead(n.id, true); 
            }
        });
    }

    setNotifications(newNotifications);
  }, [rawNotifications, readIds, loading]);


  const markAsRead = useCallback((id: string, internalCall = false) => {
    setReadIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      try {
        localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(newSet)));
      } catch (e) {
        console.error("Failed to save read notifications to localStorage", e);
      }
      return newSet;
    });
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setReadIds(prev => {
        const newSet = new Set(prev);
        notifications.forEach(n => newSet.add(n.id));
        try {
            localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(newSet)));
        } catch (e) {
             console.error("Failed to save read notifications to localStorage", e);
        }
        return newSet;
    });
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const value = {
      notifications: user ? notifications : [],
      unreadCount: user ? unreadCount : 0,
      markAsRead,
      markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
