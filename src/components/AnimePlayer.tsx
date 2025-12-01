
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface Source {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

interface Subtitle {
  lang: string;
  url: string;
}

export default function AnimePlayer({
  sources,
  subtitles = [],
  intro,
  outro,
}: {
  sources: Source[];
  subtitles?: Subtitle[];
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || sources.length === 0) return;

    const video = videoRef.current;
    const hlsUrl = sources[0].url; // Already proxied!

    let hls: Hls;

    const startPlayback = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          xhrSetup: (xhr) => {
            xhr.setRequestHeader("Referer", "https://hianime.to");
            xhr.setRequestHeader("Origin", "https://hianime.to");
          },
        });

        hls.loadSource(hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error("HLS Fatal:", data);
            setError("Stream failed. Try another episode.");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play();
        });
      }

      // Add subtitles
      subtitles.forEach((sub) => {
        const track = document.createElement("track");
        track.kind = "captions";
        track.label = sub.lang;
        track.srclang = sub.lang.slice(0, 2);
        track.src = sub.url;
        track.default = sub.lang.toLowerCase().includes('english');
        video.appendChild(track);
      });

      // Skip intro/outro
      const skipSegment = (start: number, end: number, text: string) => {
        if (!video.parentNode) return;

        const btn = document.createElement("button");
        btn.textContent = `Skip ${text}`;
        btn.className = "absolute right-4 bottom-20 bg-blue-600 text-white px-4 py-2 rounded z-50 text-sm";
        btn.onclick = () => (video.currentTime = end + 1);
        
        let animationFrameId: number;
        
        const check = () => {
          if (video.currentTime >= start && video.currentTime <= end) {
            if (!video.parentNode?.contains(btn)) video.parentNode?.appendChild(btn);
          } else {
            btn.remove();
          }
          animationFrameId = requestAnimationFrame(check);
        };
        
        check();
        return () => cancelAnimationFrame(animationFrameId);
      };

      let cancelIntro: (() => void) | undefined;
      let cancelOutro: (() => void) | undefined;

      if (intro) cancelIntro = skipSegment(intro.start, intro.end, "Intro");
      if (outro) cancelOutro = skipSegment(outro.start, outro.end, "Outro");

      return () => {
        if (cancelIntro) cancelIntro();
        if (cancelOutro) cancelOutro();
      }
    };

    const cleanup = startPlayback();

    return () => {
      if (hls) hls.destroy();
      if (cleanup) cleanup();
    };
  }, [sources, subtitles, intro, outro]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        preload="metadata"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-white text-xl animate-pulse">
            Loading stream...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}
    </div>
  );
}
