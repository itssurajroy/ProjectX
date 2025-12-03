
// src/app/(site)/forum/page.tsx
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ForumCategoryList from '@/components/forum/ForumCategoryList';
import ForumLiveChat from '@/components/forum/ForumLiveChat';

export default function ForumPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-glow">Community Forum</h1>
        <p className="text-muted-foreground mt-2">
          Discuss your favorite anime, theories, and more with the community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
            <Suspense
                fallback={
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                }
            >
                <ForumCategoryList />
            </Suspense>
        </div>
        <div className="lg:col-span-4">
            <div className="sticky top-20">
                <ForumLiveChat />
            </div>
        </div>
      </div>
    </div>
  );
}
