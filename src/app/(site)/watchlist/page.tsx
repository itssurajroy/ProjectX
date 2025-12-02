
'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import WatchlistClient from '@/components/WatchlistClient';

export default function WatchlistPage() {
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
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">Login to see your watchlist</h3>
          <p className="text-muted-foreground">Add shows to your watchlist to see them here.</p>
        </div>
      </div>
    );
  }

  return <WatchlistClient userId={user.uid} />;
}
