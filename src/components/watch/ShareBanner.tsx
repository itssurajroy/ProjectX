
'use client';

import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

export default function ShareBanner() {
  const socialShares = [
    { name: '💖', count: '40k' },
    { name: '🤯', count: '4.4k' },
    { name: '😢', count: '6.5k' },
    { name: '😂', count: '5.8k' },
    { name: '😠', count: '18.3k', isDestructive: true },
  ];

  return (
    <div className="bg-card/50 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/50">
        <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
                <h3 className="font-bold">Love this site?</h3>
                <p className="text-xs text-muted-foreground">Share it and let others know!</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
            {socialShares.map(share => (
                 <Button key={share.name} variant={share.isDestructive ? 'destructive' : 'secondary'} size="sm" className="gap-2">
                    <span>{share.name}</span>
                    <span className="font-semibold">{share.count}</span>
                 </Button>
            ))}
        </div>
    </div>
  );
}
