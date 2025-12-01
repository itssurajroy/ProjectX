// src/app/watch2gether/[roomId]/page.tsx
'use client';

import { Suspense } from 'react';
import Watch2GetherClient from '@/components/watch2gether/Watch2GetherClient';
import { Loader2 } from 'lucide-react';

export default function Watch2GetherRoomPage({ params }: { params: { roomId: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      }
    >
      <Watch2GetherClient roomId={params.roomId} />
    </Suspense>
  );
}
