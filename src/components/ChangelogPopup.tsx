
'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, SkipForward, Info, Bug, Search } from 'lucide-react';
import { useChangelogStore } from '@/store/changelog-store';

const features = [
  {
    title: 'Search Jutsu: Mind-Reader Technique',
    description: 'Our search bar has mastered a forbidden art. It now reads your mind, providing instant, god-tier suggestions before you can even finish typing.',
    icon: <Search className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Filler Arc Time-Skip',
    description: 'A new power awakens! You are now warned of filler episodes and can instantly time-skip to the next canon installment.',
    icon: <SkipForward className="w-5 h-5 text-primary" />,
  },
  {
    title: 'System Power-Up & Stability Overhaul',
    description: 'We\'ve powered up our core systems to the next level (Next.js 15) and defeated countless bugs for a legendary, lightning-fast experience.',
    icon: <Zap className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Scroll of Knowledge: A-Z List',
    description: 'The ancient tooltips on the A-Z List have had their seals removed. Hover to reveal forbidden knowledge about any series once more.',
    icon: <Info className="w-5 h-5 text-primary" />,
  },
];

const CHANGELOG_VERSION = '1.02';

export default function ChangelogPopup() {
  const { isOpen, closeChangelog, openChangelog } = useChangelogStore();

  useEffect(() => {
    const hasSeenChangelog = sessionStorage.getItem(`changelog_${CHANGELOG_VERSION}`);
    if (!hasSeenChangelog) {
      openChangelog();
      sessionStorage.setItem(`changelog_${CHANGELOG_VERSION}`, 'true');
    }
  }, [openChangelog]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            closeChangelog();
        }
    }}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <Zap className="w-7 h-7 text-primary" />
            Update v1.02: The Saga Continues!
          </DialogTitle>
          <DialogDescription>
            A new chapter begins! We've unlocked new powers and fixed ancient bugs to forge a better anime empire for you.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{feature.icon}</div>
              <div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={closeChangelog}>Continue Your Adventure</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
