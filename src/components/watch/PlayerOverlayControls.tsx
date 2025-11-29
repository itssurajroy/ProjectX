
'use client';

import { Button } from "@/components/ui/button";
import { Bookmark, Expand, MonitorPlay, Play, SkipForward, Users, Flag, SkipBack } from "lucide-react";

interface PlayerOverlayControlsProps {
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export default function PlayerOverlayControls({ onPrev, onNext, isPrevDisabled, isNextDisabled }: PlayerOverlayControlsProps) {
  const controls = [
    { icon: Expand, label: "Expand" },
    { icon: MonitorPlay, label: "AutoNext" },
    { icon: Play, label: "AutoPlay" },
    { icon: SkipForward, label: "AutoSkip" },
  ];

  const actions = [
      {icon: SkipBack, label: "Prev", action: onPrev, disabled: isPrevDisabled}, 
      {icon: SkipForward, label: "Next", action: onNext, disabled: isNextDisabled}, 
      {icon: Bookmark, label: "Bookmark"},
      {icon: Users, label: "W2G"}, 
      {icon: Flag, label: "Report"},
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
        {actions.map(item => (
          <Button key={item.label} onClick={item.action} disabled={item.disabled} variant="ghost" size="sm" className="text-muted-foreground h-auto p-1.5">
            <item.icon className="w-4 h-4 mr-1" /> {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
