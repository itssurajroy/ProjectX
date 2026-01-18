
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, Smartphone, Sparkles, Bug } from 'lucide-react';
import { useChangelogStore } from '@/store/changelog-store';

const features = [
  {
    title: 'Homepage Spotlight: Remastered',
    description: 'The homepage hero section has been completely rebuilt with fluid animations, auto-rotating anime, and a real-time countdown for upcoming episodes.',
    icon: <Sparkles className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Mobile UI Overhaul: Details Page',
    description: 'The anime details page on mobile has been redesigned from the ground up for a cleaner, more intuitive, and visually appealing experience.',
    icon: <Smartphone className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Bug Extermination & Build Fortification',
    description: 'We\'ve crushed critical bugs causing build failures and internal server errors, making the entire platform more stable and reliable than ever.',
    icon: <Bug className="w-5 h-5 text-primary" />,
  },
];

const CHANGELOG_VERSION = '1.03';

export default function ChangelogPopup() {
  const { isOpen, closeChangelog, openChangelog } = useChangelogStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const hasSeenChangelog = sessionStorage.getItem(`changelog_${CHANGELOG_VERSION}`);
    if (!hasSeenChangelog) {
      openChangelog();
      sessionStorage.setItem(`changelog_${CHANGELOG_VERSION}`, 'true');
    }
  }, [openChangelog, isClient]);

  if (!isClient) {
    return null;
  }

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
            Update v1.03: The Experience Evolves!
          </DialogTitle>
          <DialogDescription>
            We've deployed major upgrades and stability fixes to enhance your anime journey. Check out what's new.
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
