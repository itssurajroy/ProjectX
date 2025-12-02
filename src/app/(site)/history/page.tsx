
'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import HistoryClient from '@/components/HistoryClient';

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary w-16 h-16" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My History</h1>
        </div>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">Login to see your history</h3>
          <p className="text-muted-foreground">Your viewing history will appear here once you are logged in.</p>
        </div>
      </div>
    );
  }

  return <HistoryClient userId={user.uid} />;
}
