
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SynopsisProps {
  description: string;
}

export default function Synopsis({ description }: SynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-display">Synopsis</h2>
      <div
        className={cn(
          "relative text-muted-foreground leading-relaxed transition-all duration-300 ease-in-out",
          !isExpanded ? 'max-h-28 overflow-hidden' : 'max-h-none'
        )}
      >
        <p dangerouslySetInnerHTML={{ __html: description }} />
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="p-0">
        {isExpanded ? 'Read Less' : 'Read More'}
      </Button>
    </div>
  );
}
