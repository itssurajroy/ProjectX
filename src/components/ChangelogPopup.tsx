
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, SkipForward, Info, Bug, Search } from 'lucide-react';

const features = [
  {
    title: 'God-Tier Search Fixed',
    description: 'The search bar and its instant suggestion dropdown have been fully repaired. Search now provides immediate, accurate results as you type.',
    icon: <Search className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Filler Episode Skipper',
    description: 'A popup now warns you about filler episodes, giving you the option to skip directly to the next canon episode.',
    icon: <SkipForward className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Performance & Stability Boost',
    description: 'Upgraded our core framework to Next.js 15 and squashed numerous bugs for a faster, more reliable experience.',
    icon: <Zap className="w-5 h-5 text-primary" />,
  },
  {
    title: 'A-Z List Tooltips Restored',
    description: 'Anime information tooltips on the A-Z list page are now fully functional again.',
    icon: <Info className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Persistent Bug Fixes',
    description: 'Finally eliminated the stubborn "Missing Permissions" error and resolved all dependency conflicts.',
    icon: <Bug className="w-5 h-5 text-primary" />,
  },
];

const CHANGELOG_VERSION = '1.02';

export default function ChangelogPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenChangelog = sessionStorage.getItem(`changelog_${CHANGELOG_VERSION}`);
    if (!hasSeenChangelog) {
      setIsOpen(true);
      sessionStorage.setItem(`changelog_${CHANGELOG_VERSION}`, 'true');
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <Zap className="w-7 h-7 text-primary" />
            What's New in v1.02
          </DialogTitle>
          <DialogDescription>
            We've rolled out some quality-of-life updates and major bug fixes to improve your viewing experience!
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
          <Button onClick={() => setIsOpen(false)}>Continue Watching</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
