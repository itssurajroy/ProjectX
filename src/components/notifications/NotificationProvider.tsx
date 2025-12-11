
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { Notification } from '@/types/notification';
import { useUser } from '@/firebase';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, writeBatch, doc, serverTimestamp, getDocs } from 'firebase/firestore';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
    }

    const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        const newUnreadCount = notifs.filter(n => !n.read).length;
        
        // Show toasts for new, unread notifications
        const oldNotifications = new Map(notifications.map(n => [n.id, n]));
        notifs.forEach(newNotif => {
            if (!oldNotifications.has(newNotif.id) && !newNotif.read) {
                toast.custom((t) => (
                    <div
                      className={`${
                        t.visible ? 'animate-in' : 'animate-out'
                      } max-w-md w-full bg-card shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-border ring-opacity-5`}
                    >
                      <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                                {newNotif.icon || '★'}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {newNotif.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {newNotif.message}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex border-l border-border">
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                ));
            }
        });

        setNotifications(notifs);
        setUnreadCount(newUnreadCount);
    });

    return () => unsubscribe();
  }, [user, notifications]); // dependencies updated to handle new toasts

  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;
    const notifRef = doc(db, 'notifications', id);
    const batch = writeBatch(db);
    batch.update(notifRef, { read: true });
    await batch.commit();
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user || unreadCount === 0) return;
    
    const batch = writeBatch(db);
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), where('read', '==', false));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
        batch.update(document.ref, { read: true });
    });

    await batch.commit();
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
