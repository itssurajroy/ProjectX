// src/app/watch2gether/[roomId]/page.tsx
'use client';

import { Suspense } from 'react';
import Watch2GetherClient from '@/components/watch2gether/Watch2GetherClient';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function Watch2GetherRoomPageContent({ params }: { params: { roomId: string } }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }
  
  // As Firebase is removed, this component will need a new backend (e.g., WebSockets)
  // to function. For now, it will render a disabled state.
  return <p className="text-center p-8 text-muted-foreground">Watch Together is temporarily offline.</p>
  // return <Watch2GetherClient roomId={params.roomId} />;
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
