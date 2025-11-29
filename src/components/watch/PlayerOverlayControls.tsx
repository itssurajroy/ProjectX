'use client';

import { Button } from "@/components/ui/button";
import { Bookmark, Expand, MonitorPlay, Play, SkipForward, Users, Flag, SkipBack, Lightbulb, MessageSquare } from "lucide-react";

interface PlayerOverlayControlsProps {
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export default function PlayerOverlayControls({ onPrev, onNext, isPrevDisabled, isNextDisabled }: PlayerOverlayControlsProps) {
  const controls = [
    { icon: Bookmark, label: "Bookmark" },
    { icon: Expand, label: "Expand" },
    { icon: Lightbulb, label: "Light On" },
    { icon: Play, label: "Auto Play On" },
    { icon: MonitorPlay, label: "Auto Next On" },
    { icon: SkipForward, label: "Auto Skip Intro On" },
    { icon: MessageSquare, label: "Comments" },
    { icon: Flag, label: "Report" },
  ];

  return (
    <div className="bg-card p-2 border border-border/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-1 flex-wrap">
        {controls.map(item => (
          <Button key={item.label} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5">
            <item.icon className="w-4 h-4 mr-1" /> {item.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
          <Button onClick={onPrev} disabled={isPrevDisabled} variant="outline" size="sm" className="h-auto p-1.5 px-3">
            <SkipBack className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button onClick={onNext} disabled={isNextDisabled} variant="outline" size="sm" className="h-auto p-1.5 px-3">
            Next <SkipForward className="w-4 h-4 ml-1" />
          </Button>
      </div>
    </div>
  );
}
