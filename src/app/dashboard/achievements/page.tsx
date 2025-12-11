'use client';

import { AnimeBase } from '@/types/anime';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/AnimeService';
import { useMemo } from 'react';
import { Award, BookOpen, Calendar, Clapperboard, Film, Flame, Loader2, Star, TrendingUp, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const achievementsList = [
    { id: 'novice-watcher', title: 'Novice Watcher', description: 'Watch 10 episodes.', goal: 10, icon: <Clapperboard className="w-8 h-8" />, type: 'episodes' },
    { id: 'anime-adept', title: 'Anime Adept', description: 'Watch 100 episodes.', goal: 100, icon: <Film className="w-8 h-8" />, type: 'episodes' },
    { id: 'series-veteran', title: 'Series Veteran', description: 'Watch 500 episodes.', goal: 500, icon: <Flame className="w-8 h-8" />, type: 'episodes' },
    { id: 'anime-master', title: 'Anime Master', description: 'Watch 1000 episodes.', goal: 1000, icon: <Trophy className="w-8 h-8" />, type: 'episodes' },
    { id: 'series-starter', title: 'Series Starter', description: 'Start watching 5 different anime.', goal: 5, icon: <BookOpen className="w-8 h-8" />, type: 'series' },
    { id: 'series-completer', title: 'Series Completer', description: 'Mark 1 anime as "Completed".', goal: 1, icon: <Star className="w-8 h-8" />, type: 'completed' },
    { id: 'dedicated-fan', title: 'Dedicated Fan', description: 'Complete 10 anime.', goal: 10, icon: <Award className="w-8 h-8" />, type: 'completed' },
    { id: 'weekend-warrior', title: 'Weekend Warrior', description: 'Watch 10 episodes in one weekend.', goal: 10, icon: <Calendar className="w-8 h-8" />, type: 'streak' },
    { id: 'genre-explorer', title: 'Genre Explorer', description: 'Watch anime from 5 different genres.', goal: 5, icon: <TrendingUp className="w-8 h-8" />, type: 'genres' },
];

const AchievementCard = ({ achievement, progress }: { achievement: typeof achievementsList[0]; progress: number }) => {
    const isUnlocked = progress >= achievement.goal;
    const progressPercent = Math.min((progress / achievement.goal) * 100, 100);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all duration-300",
                        isUnlocked 
                            ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/20" 
                            : "bg-card/50 border-border/50"
                    )}>
                        <div className={cn("mb-3", isUnlocked ? "text-primary" : "text-muted-foreground")}>
                            {achievement.icon}
                        </div>
                        <h3 className="font-bold">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">{achievement.description}</p>
                        <div className="w-full mt-auto">
                            <Progress value={progressPercent} className="h-2"/>
                            <p className="text-xs text-muted-foreground mt-1">{Math.floor(progress)} / {achievement.goal}</p>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {isUnlocked ? <p>Unlocked!</p> : <p>{achievement.goal - progress} more to go!</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function AchievementsPage() {
    // This page is now non-functional as it relied on Firebase for user data.
    // Displaying a placeholder state.
    const isLoading = false;
    const achievementProgress: Record<string, number> = {};

    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-primary" />
                Achievements
            </h1>

            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">Please log in to view your achievements.</p>
                <p className="text-xs text-muted-foreground mt-1">This feature is temporarily disabled.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 opacity-20 pointer-events-none">
                {achievementsList.map(ach => (
                    <AchievementCard key={ach.id} achievement={ach} progress={achievementProgress[ach.type] || 0} />
                ))}
            </div>
        </div>
    )
}
