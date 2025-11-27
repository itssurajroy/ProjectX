'use client';

import type { Media } from "@/lib/data";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings, Captions, Info
} from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  media: Media;
}

export default function VideoPlayer({ media }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSource, setActiveSource] = useState('SUB');

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player">
      {/* Fake video element */}
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Video stream for {media.title}</p>
      </div>

      {/* Countdown overlay */}
      {/* <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
        <p className="text-white">Next episode in</p>
        <p className="text-6xl font-bold text-white">3</p>
        <Button className="mt-4">Cancel</Button>
      </div> */}

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-10">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">{media.title} - Episode 1</h3>
           <div className="flex items-center gap-2">
            {['SUB', 'DUB', 'RAW'].map(source => (
              <Button 
                key={source}
                size="sm"
                variant={activeSource === source ? 'default' : 'secondary'}
                onClick={() => setActiveSource(source)}
                className={cn("h-8", activeSource === source && "bg-primary text-primary-foreground")}
              >
                {source}
              </Button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Timeline */}
            <Slider defaultValue={[15]} max={100} step={1} />
          
            <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </Button>
                        <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
                    </div>
                    <span className="text-sm font-mono">10:30 / 23:45</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden md:flex bg-transparent text-white hover:bg-white/10 hover:text-white border-white/50 h-9">
                        <SkipBack className="h-4 w-4 mr-2"/>
                        Skip Intro
                    </Button>
                     <Button variant="outline" className="hidden md:flex bg-transparent text-white hover:bg-white/10 hover:text-white border-white/50 h-9">
                        Next Ep
                        <SkipForward className="h-4 w-4 ml-2"/>
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <Settings className="h-6 w-6" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 bg-background/80 backdrop-blur-sm border-slate-700 text-foreground">
                            <div className="grid gap-4">
                                <h4 className="font-medium leading-none">Settings</h4>
                                <p className="text-sm text-muted-foreground">
                                    Quality, source, etc.
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Maximize className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
