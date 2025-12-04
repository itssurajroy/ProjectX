'use client';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { ScheduleResponse } from '@/types/anime';
import { useState } from 'react';
import { format, add, sub, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const DayColumn = ({ day, animes }: { day: string; animes: ScheduleResponse['scheduledAnimes'] }) => (
    <div className="bg-card/50 rounded-lg p-3 border border-border/50">
        <h3 className="font-bold text-center mb-3 pb-2 border-b border-border/50">{day}</h3>
        <div className="space-y-2">
            {animes.length > 0 ? animes.map(anime => (
                 <Link key={anime.id} href={`/anime/${anime.id}`} className={cn(
                    "flex justify-between items-center group p-2 rounded-md hover:bg-muted/50 border-b border-border/50 last:border-b-0",
                )}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-sm font-bold w-10 text-center text-muted-foreground">{anime.time}</span>
                        <p className="truncate font-semibold text-sm group-hover:text-primary transition-colors">{anime.name}</p>
                    </div>
                    <span className='text-xs text-muted-foreground'>EP {anime.episode || '?'}</span>
                </Link>
            )) : <p className="text-center text-xs text-muted-foreground pt-4">No releases.</p>}
        </div>
    </div>
)

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { data, isLoading, error, refetch } = useQuery<Record<string, ScheduleResponse>>({
        queryKey: ['fullSchedule', format(currentDate, 'yyyy-MM-dd')],
        queryFn: async () => {
            const weekStart = startOfWeek(currentDate);
            const schedulePromises = Array.from({ length: 7 }).map((_, i) => {
                const day = add(weekStart, { days: i });
                const dateString = format(day, 'yyyy-MM-dd');
                return AnimeService.getSchedule(dateString).then(res => ({ [dateString]: res }));
            });
            const results = await Promise.all(schedulePromises);
            return Object.assign({}, ...results);
        },
    });

    const handleDateChange = (direction: 'next' | 'prev') => {
        const amount = { weeks: 1 };
        setCurrentDate(current => direction === 'next' ? add(current, amount) : sub(current, amount));
    };

    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);

    const weekDays = Array.from({ length: 7 }).map((_, i) => add(weekStart, { days: i }));

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-96 col-span-full">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            )
        }
        if (error) {
            return (
                 <div className="col-span-full">
                    <ErrorDisplay title="Failed to load schedule" description={error.message} onRetry={refetch} />
                </div>
            )
        }
        return weekDays.map(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            const dayName = format(day, 'EEEE');
            const scheduledAnimes = data?.[dateString]?.scheduledAnimes || [];
            return <DayColumn key={dateString} day={dayName} animes={scheduledAnimes} />
        })
    }

    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <CalendarIcon className="w-8 h-8 text-primary" />
                Airing Calendar
            </h1>
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                    Weekly anime release schedule.
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleDateChange('prev')}><ChevronLeft className="w-4 h-4" /></Button>
                    <span className="font-semibold text-sm w-48 text-center">{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
                    <Button variant="outline" size="icon" onClick={() => handleDateChange('next')}><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {renderContent()}
            </div>
        </div>
    )
}
