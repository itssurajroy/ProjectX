'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AZList() {
  const alphabet = ['All', '#', '0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const getCharPath = (char: string) => {
      if (char === 'All') return 'all';
      if (char === '#') return 'other';
      return char.toLowerCase();
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {alphabet.map((char) => {
          const charPath = getCharPath(char);
          return (
            <Link
              key={char}
              href={`/az-list/${charPath}`}
              className={cn(
                'flex h-8 min-w-[2rem] px-2 items-center justify-center rounded-md bg-card/80 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground'
              )}
            >
              {char}
            </Link>
          )
        })}
      </div>
    </div>
  );
}