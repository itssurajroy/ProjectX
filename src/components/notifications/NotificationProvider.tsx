
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const user = null; // Mock user
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
    }

    // Firebase logic removed.
    // In a real implementation with a new backend, this is where you'd
    // subscribe to notification events (e.g., via WebSockets).
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    // Backend logic removed
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    // Backend logic removed
  }, [user, unreadCount]);


  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
      <Toaster position="top-right" />
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
