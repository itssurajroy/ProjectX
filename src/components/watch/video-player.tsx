'use client';

import { useState, useEffect, useRef } from "react";
import { AnimeAbout, AnimeEpisode } from "@/types/anime";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { cn, extractEpisodeId } from "@/lib/utils";

type VideoPlayerProps = {
  anime: AnimeAbout;
  episode: AnimeEpisode | undefined;
  language: 'sub' | 'dub';
}

const LOAD_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;

export default function VideoPlayer({ anime, episode, language }: VideoPlayerProps) {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [iframeKey, setIframeKey] = useState(Date.now());
  const retryCount = useRef(0);

  useEffect(() => {
    if (episode) {
      retryCount.current = 0;
      setStatus('loading');
      setIframeKey(Date.now()); // Reset key to force iframe reload on episode/language change
    }
  }, [episode, language]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'loading') {
      timer = setTimeout(() => {
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          setIframeKey(Date.now()); // Trigger a reload
        } else {
          setStatus('error');
        }
      }, LOAD_TIMEOUT);
    }
    return () => clearTimeout(timer);
  }, [status, iframeKey]);

  if (!episode) {
    return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player flex items-center justify-center">
            <p className="text-muted-foreground">Select an episode to begin.</p>
        </div>
    )
  }

  const episodeNumberId = extractEpisodeId(episode.episodeId);
  if (!episodeNumberId) {
    // Handle cases where the episodeId format is unexpected
     return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
           <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
           <p className="text-lg font-semibold mb-2">Invalid Episode ID</p>
        </div>
    )
  }

  const iframeSrc = `https://megaplay.buzz/stream/s-2/${episodeNumberId}/${language}`;

  const handleManualReload = () => {
    retryCount.current = 0;
    setStatus('loading');
    setIframeKey(Date.now());
  };

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player">
        {status !== 'success' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 text-white p-4">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-lg font-semibold">Loading Player...</p>
                        {retryCount.current > 0 && <p className="text-sm text-muted-foreground mt-2">Attempting to connect... ({retryCount.current}/{MAX_RETRIES})</p>}
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                        <p className="text-lg font-semibold mb-2">Failed to Load Video</p>
                        <p className="text-sm text-muted-foreground mb-4 text-center">The video source seems to be offline. Please try another server or reload.</p>
                        <button 
                            onClick={handleManualReload}
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-colors"
                        >
                           <RefreshCw className="w-4 h-4" /> Reload Player
                        </button>
                    </>
                )}
             </div>
        )}
        <iframe
            key={iframeKey}
            src={iframeSrc}
            allowFullScreen
            onLoad={() => setStatus('success')}
            className={cn("w-full h-full", status !== 'success' && "invisible")}
            scrolling="no"
            frameBorder="0"
        ></iframe>

        <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleManualReload} className="flex items-center gap-2 text-xs bg-black/50 text-white py-1 px-2 rounded-md hover:bg-black/80">
                <RefreshCw className="w-3 h-3"/> Server not working?
            </button>
        </div>
    </div>
  );
}
