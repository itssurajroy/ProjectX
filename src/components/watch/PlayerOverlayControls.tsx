
'use client';

import { Button } from "@/components/ui/button";
import { Bookmark, Expand, MonitorPlay, Play, SkipForward, Users, Flag, SkipBack, Sun, Lightbulb } from "lucide-react";
import { usePlayerSettings } from "@/store/player-settings";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PlayerOverlayControlsProps {
    onPrev: () => void;
    onNext: () => void;
    onW2G: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

const ControlButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isStatic = false,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  isActive?: boolean;
  isStatic?: boolean;
}) => {
    const activeClass = isActive ? "text-primary" : "text-muted-foreground";
    return (
        <Button onClick={onClick} variant="ghost" size="sm" className={cn("h-auto p-1.5 gap-1", !isStatic && activeClass)}>
            <Icon className="w-4 h-4" /> {label}
        </Button>
    )
}

export default function PlayerOverlayControls({ onPrev, onNext, onW2G, isPrevDisabled, isNextDisabled }: PlayerOverlayControlsProps) {
  const { 
      isFocusMode, 
      toggleFocusMode, 
      autoNext, 
      toggleAutoNext,
      autoPlay,
      toggleAutoPlay,
      autoSkip,
      toggleAutoSkip,
  } = usePlayerSettings();
  
  const handleBookmark = () => toast.success("Added to your watchlist!");
  const handleReport = () => toast.error("Report form is coming soon!");
  
  const leftControls = [
    { icon: Sun, label: "Focus", onClick: toggleFocusMode, isActive: isFocusMode },
    { icon: MonitorPlay, label: "AutoNext", onClick: toggleAutoNext, isActive: autoNext },
    { icon: Play, label: "AutoPlay", onClick: toggleAutoPlay, isActive: autoPlay },
    { icon: SkipForward, label: "AutoSkip", onClick: toggleAutoSkip, isActive: autoSkip },
  ];
  
  const rightControls = [
      { icon: Bookmark, label: "Bookmark", onClick: handleBookmark, isStatic: true},
      { icon: Users, label: "W2G", onClick: onW2G, isStatic: true },
      { icon: Flag, label: "Report", onClick: handleReport, isStatic: true },
  ]

  return (
    <div className="bg-card/50 p-2 border border-border/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {leftControls.map(item => (
          <ControlButton key={item.label} {...item} />
        ))}
      </div>
      <div className="w-full sm:w-auto flex items-center gap-1 flex-wrap justify-center">
          <Button onClick={onPrev} disabled={isPrevDisabled} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5 px-3 flex-1 sm:flex-none">
            <SkipBack className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5 px-3 flex-1 sm:flex-none">
            Next <SkipForward className="w-4 h-4 ml-1" />
          </Button>
          <div className="hidden sm:flex items-center gap-1 flex-wrap">
            {rightControls.map(item => (
              <ControlButton key={item.label} {...item} />
            ))}
          </div>
      </div>
    </div>
  );
}
