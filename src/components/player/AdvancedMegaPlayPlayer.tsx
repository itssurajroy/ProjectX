// components/player/AdvancedMegaPlayPlayer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvancedMegaPlayPlayerProps {
  iframeSrc: string;
  server?: string;
  title?: string;
  episode?: string;
  onNextEpisode?: () => void;
  onSourceError?: () => void;
}

export default function AdvancedMegaPlayPlayer({
  iframeSrc,
  server = "MegaPlay",
  title = "Episode",
  episode = "",
  onNextEpisode,
  onSourceError,
}: AdvancedMegaPlayPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setShowOverlay(true); // Show overlay when source changes
  }, [iframeSrc]);


  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onSourceError?.();
  };

  const handlePlayClick = () => {
    setShowOverlay(false);
    // You might need to send a postMessage to the iframe to start playback
    // This depends on the player inside the iframe
    iframeRef.current?.contentWindow?.postMessage({ command: "play" }, "*");
  };


  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
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

      {/* Loading/Error/Play Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10" onClick={handlePlayClick}>
           <div className="absolute inset-0 w-full h-full">
              <Image src="https://picsum.photos/seed/opm-fight/1280/720" alt="Player background" fill className="object-cover opacity-30" data-ai-hint="anime fight" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="relative z-20 flex items-center justify-center w-20 h-20 bg-black/50 rounded-full border-2 border-white/50 cursor-pointer hover:bg-primary/80 hover:scale-110 transition-all">
                <Play className="w-10 h-10 text-white fill-white" />
            </div>
        </div>
      )}


      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Loading Player...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-white">Stream Unavailable</h3>
              <p className="text-muted-foreground mt-1">The '{server}' source failed to load.</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
              {onSourceError && (
                <Button variant="secondary" onClick={onSourceError}>
                  Change Server
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
