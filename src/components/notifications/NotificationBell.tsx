'use client';

import { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  // Since notifications are disabled, we can simplify this component
  // or show a disabled state.

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full bg-card hover:bg-muted"
        disabled
        title="Notifications are temporarily disabled"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
