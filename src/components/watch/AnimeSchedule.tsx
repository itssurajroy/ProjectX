
'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Loader2 } from 'lucide-react';
import { AnimeService } from '@/lib/AnimeService';
import { ScheduleResponse } from '@/types/anime';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AnimeScheduleProps {
  animeId: string;
  animeName: string;
}

export default function AnimeSchedule({ animeId, animeName }: AnimeScheduleProps) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data, isLoading, error } = useQuery<ScheduleResponse>({
    queryKey: ['schedule', today],
    queryFn: () => AnimeService.getSchedule(today),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const animeSchedule = data?.scheduledAnimes.find(
    (anime) => anime.id === animeId
  );

  if (isLoading) {
    return (
      <div className="bg-card/50 p-3 rounded-lg border border-border/50 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking for today's schedule...</span>
      </div>
    );
  }

  if (error || !animeSchedule) {
    return null; // Don't show anything if there's an error or no schedule for this anime today
  }

  return (
    <Alert className="bg-card/50 border-border/50">
        <Calendar className="h-4 w-4" />
        <AlertTitle className="font-semibold">Airs Today!</AlertTitle>
        <AlertDescription>
           Episode {animeSchedule.episode} of {animeName} is scheduled to be released today at approximately <strong>{animeSchedule.time}</strong>.
        </AlertDescription>
    </Alert>
  );
}
