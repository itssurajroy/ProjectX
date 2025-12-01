
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

export default function Spoiler({ children }: { children: React.ReactNode }) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (isRevealed) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative cursor-pointer rounded-md bg-muted/30 p-2 my-1"
      onClick={() => setIsRevealed(true)}
    >
      <div className={cn('blur-sm select-none', isRevealed && 'blur-none')}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
          <Eye className="w-4 h-4" />
          Spoiler - Click to reveal
        </div>
      </div>
    </div>
  );
}
