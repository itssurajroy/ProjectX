
'use client';

import { Button } from "@/components/ui/button";
import { Bookmark, Expand, MonitorPlay, Play, SkipForward, Users, Flag, SkipBack, Lightbulb, MessageSquare, Sun, Moon } from "lucide-react";

interface PlayerOverlayControlsProps {
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export default function PlayerOverlayControls({ onPrev, onNext, isPrevDisabled, isNextDisabled }: PlayerOverlayControlsProps) {
  const controls = [
    { icon: Expand, label: "Expand" },
    { icon: Sun, label: "Focus" },
    { icon: MonitorPlay, label: "AutoNext" },
    { icon: Play, label: "AutoPlay" },
    { icon: SkipForward, label: "AutoSkip" },
  ];
  
  const rightControls = [
      { icon: Bookmark, label: "Bookmark"},
      { icon: Users, label: "W2G" },
      { icon: Flag, label: "Report" },
  ]

  return (
    <div className="bg-card/50 p-2 border border-border/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-1 flex-wrap">
        {controls.map(item => (
          <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5">
            <item.icon className="w-4 h-4 mr-1" /> {item.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
          <Button onClick={onPrev} disabled={isPrevDisabled} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5 px-3">
            <SkipBack className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5 px-3">
            Next <SkipForward className="w-4 h-4 ml-1" />
          </Button>
          {rightControls.map(item => (
             <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5">
                <item.icon className="w-4 h-4 mr-1" /> {item.label}
             </Button>
          ))}
      </div>
    </div>
  );
}
