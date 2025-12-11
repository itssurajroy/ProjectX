
// src/app/watch2gether/[roomId]/page.tsx
'use client';

import { Suspense } from 'react';
import Watch2GetherClient from '@/components/watch2gether/Watch2GetherClient';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Watch2GetherRoomPageContent({ params }: { params: { roomId: string } }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

  return <Watch2GetherClient roomId={params.roomId} />;
}

export default function Watch2GetherRoomPage({ params }: { params: { roomId: string } }) {
  return (
    <div className="bg-background">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        }
      >
        <Watch2GetherRoomPageContent params={params} />
      </Suspense>
    </div>
  );
}
