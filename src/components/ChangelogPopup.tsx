'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Star, Users } from 'lucide-react';

const features = [
  {
    title: 'Complete Streaming Experience',
    description: 'Watch your favorite anime with our new modern player, complete with server selection and episode tracking.',
    icon: <Rocket className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Community & Comments',
    description: 'Discuss episodes and series with the community through our brand new, real-time comment sections.',
    icon: <Users className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Personalized Watchlist & History',
    description: 'Log in to keep track of shows you want to watch and what you\'ve already seen.',
    icon: <Star className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Watch Together',
    description: 'Create or join public rooms to watch anime in sync with friends and other fans.',
    icon: <Sparkles className="w-5 h-5 text-primary" />,
  },
];

const CHANGELOG_VERSION = '1.0';

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
            <Rocket className="w-7 h-7 text-primary" />
            Welcome to ProjectX v1.0!
          </DialogTitle>
          <DialogDescription>
            We've launched a brand new version of the site, packed with features for the community.
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
          <Button onClick={() => setIsOpen(false)}>Start Watching</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
