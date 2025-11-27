'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AZList() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = ['123'];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {numbers.map((num) => (
          <Link
            key={num}
            href={`/search?az=${num}`}
            className={cn(
              'flex h-8 w-10 items-center justify-center rounded-md bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground'
            )}
          >
            {num}
          </Link>
        ))}
        {alphabet.map((letter) => (
          <Link
            key={letter}
            href={`/search?az=${letter}`}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground'
            )}
          >
            {letter}
          </Link>
        ))}
      </div>
    </div>
  );
}
