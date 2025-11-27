// components/player/AdvancedMegaPlayPlayer.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, AlertCircle, Play, Volume2, VolumeX, Maximize, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdvancedMegaPlayPlayerProps {
  episodeId: string;
  initialLang?: "sub" | "dub" | "raw";
  title?: string;
  episode?: string;
  onSourceError?: () => void;
}

export default function AdvancedMegaPlayPlayer({
  episodeId,
  initialLang = "sub",
  title = "Episode",
  episode = "",
  onSourceError,
}: AdvancedMegaPlayPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<"sub" | "dub" | "raw">(initialLang);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const iframeUrl = `https://megaplay.buzz/stream/s-2/${episodeId}/${lang}`;

  // Auto-hide controls after 3s of inactivity
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimer();
    window.addEventListener("mousemove", handleMouseMove);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Handle iframe load/error
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onSourceError?.();
  };
  
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [episodeId, lang]);
  
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang])

  // Language switcher
  const changeLanguage = (newLang: "sub" | "dub" | "raw") => {
    if (newLang === lang) return;
    setIsLoading(true);
    setHasError(false);
    setLang(newLang);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black group rounded-lg overflow-hidden"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Iframe */}
      <iframe
        key={`${episodeId}-${lang}`}
        ref={iframeRef}
        src={iframeUrl}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        onLoad={handleLoad}
        onError={handleError}
        title={`${title} ${episode} - ${lang.toUpperCase()}`}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-center space-y-4">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <p className="text-white text-xl font-medium">Loading {lang.toUpperCase()} stream...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-center space-y-6">
            <AlertCircle className="w-20 h-20 text-destructive mx-auto" />
            <div>
              <p className="text-white text-2xl font-bold mb-2">Stream Unavailable</p>
              <p className="text-gray-400">The video source failed to load.</p>
            </div>
            <div className="space-x-4">
              <Button onClick={() => { setIsLoading(true); setHasError(false); }} className="bg-primary hover:bg-primary/80">
                Retry
              </Button>
              {onSourceError &&
                <Button variant="outline" onClick={onSourceError} className="border-white/50 text-white">
                    Try Another Source
                </Button>
              }
            </div>
          </div>
        </div>
      )}

      {/* Custom Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          showControls || isLoading || hasError ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top Gradient + Title */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">{title}</h1>
              <p className="text-gray-300">Episode {episode}</p>
            </div>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-black/50 border-white/30 text-white hover:bg-white/20">
                  <Volume2 className="w-4 h-4 mr-2" />
                  {lang.toUpperCase()}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-white/20">
                <DropdownMenuItem onClick={() => changeLanguage("sub")} className="text-white hover:bg-white/10">
                  SUB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("dub")} className="text-white hover:bg-white/10">
                  DUB
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("raw")} className="text-white hover:bg-white/10">
                  RAW
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>

              <div className="text-white">
                <p className="text-sm opacity-80">Source: MegaPlay.buzz</p>
                <p className="text-xs opacity-60">Protected Embed • 100% Uptime</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
                <Maximize className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center Play Icon (when paused or idle) */}
        {!isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-20 h-20 text-white fill-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
