// components/player/AdvancedMegaPlayPlayer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvancedMegaPlayPlayerProps {
  iframeSrc: string;
  server: string;
  title?: string;
  episode?: string;
  onNextEpisode?: () => void;
  onSourceError?: () => void;
}

export default function AdvancedMegaPlayPlayer({
  iframeSrc,
  server,
  title = "Episode",
  episode = "",
  onSourceError,
}: AdvancedMegaPlayPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [iframeSrc]);


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

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onSourceError?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: "16/9" }}
    >
      {/* Iframe */}
      {iframeSrc && (
          <iframe
            key={iframeSrc}
            ref={iframeRef}
            src={iframeSrc}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleLoad}
            onError={handleError}
            title={`${title} - Episode ${episode}`}
          />
      )}


      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading stream from {server}...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="text-center space-y-6">
            <AlertCircle className="w-20 h-20 text-primary mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-white">Stream Failed</h3>
              <p className="text-muted-foreground mt-2">{server} source is unavailable</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90"
              >
                Retry
              </Button>
              {onSourceError && (
                <Button variant="outline" onClick={onSourceError} className="border-border">
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
        {/* Center Play Button (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white/10 rounded-full p-8 border border-white/20">
            <Play className="w-20 h-20 text-white fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
}

    