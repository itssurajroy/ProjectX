
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SynopsisProps {
  description: string;
}

export default function Synopsis({ description }: SynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Add a guard clause to handle null or undefined description
  if (!description) {
    return <p className="text-sm text-muted-foreground">No synopsis available.</p>;
  }

  // Determine if the description is long enough to need truncation
  const needsTruncation = description.length > 250;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative text-muted-foreground leading-relaxed transition-all duration-300 ease-in-out text-sm",
          !isExpanded && needsTruncation ? 'max-h-20 overflow-hidden' : 'max-h-none'
        )}
      >
        <p dangerouslySetInnerHTML={{ __html: description }} />
        {!isExpanded && needsTruncation && (
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      {needsTruncation && (
        <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="p-0 h-auto text-xs">
          {isExpanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </div>
  );
}
