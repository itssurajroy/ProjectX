
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import type { Notification } from '@/types/notification';

// MOCK USER - Replace with your actual user object
const mockUser = {
  uid: 'anonymous-user-123',
  name: 'Anonymous',
};


interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);
const { firestore } = initializeFirebase();

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // MOCK: Using a mock user until auth is implemented
  const user = mockUser; 
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    
    // Path should be /notifications/{userId}/items
    const notificationsColRef = collection(firestore, 'notifications', user.uid, 'items');

    const q = query(
      notificationsColRef,
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      let unread = 0;
      
      const newNotificationsFromSnapshot: Notification[] = [];

      snapshot.docChanges().forEach((change) => {
        if(change.type === 'added') {
            const data = change.doc.data();
            const notification = { id: change.doc.id, ...data } as Notification;
            if(!notification.read) {
                // Check if the notification is recent (e.g., within last 10 seconds) to avoid showing old unread toasts
                const isRecent = notification.createdAt && (new Date().getTime() - notification.createdAt.toDate().getTime() < 10000);
                if (isRecent) {
                    newNotificationsFromSnapshot.push(notification);
                }
            }
        }
      });

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        notifs.push({ id: doc.id, ...data } as Notification);
        if (!data.read) unread++;
      });
      
      setNotifications(notifs);
      setUnreadCount(unread);

      // Show toast for new unread notifications
      newNotificationsFromSnapshot.forEach(n => {
        toast.custom((t) => (
          <div className={`max-w-sm w-full bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 ${t.visible ? 'animate-in fade-in' : 'animate-out fade-out'}`}>
            <div className="flex p-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {n.icon || '★'}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white">{n.title}</p>
                <p className="text-sm text-gray-400 mt-1">{n.message}</p>
              </div>
            </div>
          </div>
        ), { duration: 6000, position: 'top-right' });
      });
    });

    return () => unsub();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    const notifRef = doc(firestore, 'notifications', user.uid, 'items', id);
    await updateDoc(notifRef, { read: true });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const batch = writeBatch(firestore);
    notifications.filter(n => !n.read).forEach(n => {
        const notifRef = doc(firestore, 'notifications', user.uid, 'items', n.id);
        batch.update(notifRef, { read: true });
    });
    await batch.commit();
  };

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
