
'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';

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
    return (
      <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-lg mt-4 text-sm">
        <p className="font-semibold">This episode has aired!</p>
      </div>
    );
  }

  const days = Math.floor(secondsRemaining / (24 * 3600));
  const hours = Math.floor((secondsRemaining % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="bg-primary/10 border border-primary/30 text-primary/90 p-3 rounded-lg mt-4 flex justify-between items-center text-sm">
      <div>
        <p className="font-semibold">Next episode airing on {format(targetDate, 'MMMM do, yyyy')}</p>
      </div>
      <div className="font-bold text-base">
        {days > 0 && `${days}d `}
        {hours > 0 && `${String(hours).padStart(2, '0')}h `}
        {`${String(minutes).padStart(2, '0')}m `}
        {`${String(seconds).padStart(2, '0')}s`}
      </div>
    </div>
  );
}
