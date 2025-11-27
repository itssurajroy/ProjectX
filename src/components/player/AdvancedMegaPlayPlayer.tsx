// components/player/AdvancedMegaPlayPlayer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, Play, Volume2, VolumeX, Maximize2, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdvancedMegaPlayPlayerProps {
  episodeId: string;
  initialLang?: "sub" | "dub" | "raw";
  title?: string;
  episode?: string;
  onNextEpisode?: () => void;
  onSourceError?: () => void;
}

export default function AdvancedMegaPlayPlayer({
  episodeId,
  initialLang = "sub",
  title = "Episode",
  episode = "",
  onNextEpisode,
  onSourceError,
}: AdvancedMegaPlayPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lang, setLang] = useState<"sub" | "dub" | "raw">(initialLang);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout>();

  const iframeUrl = `https://megaplay.buzz/stream/s-2/${episodeId}/${lang}`;

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    };

    const handleActivity = () => resetTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // Reset loading/error when episode or language changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [episodeId, lang]);
  
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang])

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onSourceError?.();
  };

  const changeLanguage = (newLang: "sub" | "dub" | "raw") => {
    if (newLang === lang) return;
    setLang(newLang);
  };

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
      className="relative w-full bg-black rounded-xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "16/9" }}
    >
      {/* MegaPlay Iframe */}
      <iframe
        key={iframeUrl}
        ref={iframeRef}
        src={iframeUrl}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleLoad}
        onError={handleError}
        title={`Episode ${episode} - ${lang.toUpperCase()}`}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading {lang.toUpperCase()} stream...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center space-y-6">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-white">Stream Failed</h3>
              <p className="text-gray-400 mt-2">MegaPlay source is unavailable</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700"
              >
                Retry
              </Button>
              {onSourceError && (
                <Button variant="outline" onClick={onSourceError} className="border-gray-600">
                  Try Another Server
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls Overlay - Always visible on hover or active */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-6 pb-20 pointer-events-auto">
          <div className="px-6 flex items-start justify-between">
            {/* Title */}
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {title}
              </h1>
              <p className="text-lg text-gray-200 mt-1">Episode {episode}</p>
            </div>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-black/60 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {lang.toUpperCase()}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-950 border-gray-800">
                <DropdownMenuItem
                  onClick={() => changeLanguage("sub")}
                  className="text-white hover:bg-red-600/30 cursor-pointer"
                >
                  SUB
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage("dub")}
                  className="text-white hover:bg-red-600/30 cursor-pointer"
                >
                  DUB
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage("raw")}
                  className="text-white hover:bg-red-600/30 cursor-pointer"
                >
                  RAW
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pb-8 pt-20 pointer-events-auto">
          <div className="px-6 flex items-center justify-between">
            {/* Left: Source Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="text-gray-300 font-medium">MegaPlay Server</p>
                <p className="text-xs text-gray-500">Protected • High Availability</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              {onNextEpisode && (
                <Button
                  onClick={onNextEpisode}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
                >
                  Next Episode →
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20 backdrop-blur-md"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center Play Button (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-8 border border-white/20">
            <Play className="w-20 h-20 text-white fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
