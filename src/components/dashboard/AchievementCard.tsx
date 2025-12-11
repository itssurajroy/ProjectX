
'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const AchievementCard = ({ achievement, progress }: { achievement: any; progress: number }) => {
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
                            <Progress value={progressPercent} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{Math.floor(progress)} / {achievement.goal}</p>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {isUnlocked ? <p>Unlocked!</p> : <p>{Math.max(0, achievement.goal - Math.floor(progress))} more to go!</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default AchievementCard;
