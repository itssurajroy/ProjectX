
'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { ScrollText } from 'lucide-react';

interface EpisodeCountdownProps {
  airingTime: number | null | undefined;
}

export default function EpisodeCountdown({ airingTime }: EpisodeCountdownProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!airingTime) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [airingTime]);

  if (!airingTime) {
    return null;
  }

  const targetDate = new Date(airingTime * 1000);
  const secondsRemaining = differenceInSeconds(targetDate, now);

  if (secondsRemaining <= 0) {
    return null;
  }

  const days = Math.floor(secondsRemaining / (24 * 3600));
  const hours = Math.floor((secondsRemaining % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  
  return (
    <div className="bg-primary/10 border border-primary/20 text-primary/90 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
        <p className="font-semibold flex items-center gap-2"><ScrollText className="w-4 h-4"/>The next episode is expected to be released on {format(targetDate, 'yyyy/MM/dd HH:mm:ss')}</p>
        <p className="font-bold text-base bg-primary/20 px-3 py-1 rounded-md">
            {`${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`}
        </p>
    </div>
  );
}
