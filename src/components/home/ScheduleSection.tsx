'use client';
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/services/AnimeService";
import { ScheduleResponse } from "@/lib/types/anime";
import { useState, useMemo } from "react";
import { format, addDays, getDay } from 'date-fns';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Button } from "../ui/button";

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleSection() {
    const [selectedDayIndex, setSelectedDayIndex] = useState(getDay(new Date())); // 0 for Sun, 1 for Mon...

    const today = new Date();
    
    // Create an array of dates for the current week, starting from Sunday
    const weekStart = addDays(today, -getDay(today));
    const weekDates = Array.from({ length: 7 }).map((_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));

    const { data, isLoading } = useQuery<ScheduleResponse>({
        queryKey: ['schedule', weekDates[selectedDayIndex]],
        queryFn: () => AnimeService.getSchedule(weekDates[selectedDayIndex]),
        staleTime: 60 * 60 * 1000, // 1 hour
    });

    const animesForSelectedDay = useMemo(() => {
        return data?.scheduledAnimes.sort((a, b) => a.airingTimestamp - b.airingTimestamp);
    }, [data]);

    return (
        <section>
            <h2 className="text-title font-bold border-l-4 border-primary pl-3 mb-4">Estimated Schedule</h2>
            <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-3">
                    <div className="flex gap-1 overflow-x-auto">
                        {dayNames.map((day, index) => (
                            <Button 
                                key={day} 
                                variant={selectedDayIndex === index ? 'default' : 'ghost'}
                                onClick={() => setSelectedDayIndex(index)}
                                className="flex-shrink-0"
                            >
                                {day}
                            </Button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center p-8">Loading schedule...</div>
                ) : animesForSelectedDay && animesForSelectedDay.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {animesForSelectedDay.map(anime => (
                            <Link href={`/anime/${anime.id}`} key={anime.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                                <div className="text-center w-12 flex-shrink-0">
                                    <div className="font-bold text-lg text-primary">{anime.time}</div>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold truncate">{anime.name}</p>
                                    <p className="text-sm text-muted-foreground">Ep {anime.episode}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground p-8">No anime scheduled for this day.</p>
                )}
            </div>
        </section>
    )
}
