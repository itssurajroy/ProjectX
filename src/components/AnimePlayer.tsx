
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Button } from './ui/button';
import { Loader2, ServerCrash, Tv } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AnimeService } from '@/lib/AnimeService';
import { sanitizeFirestoreId } from '@/lib/utils';
import { EpisodeServer } from '@/types/anime';

interface Source {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

interface Subtitle {
  lang: string;
  url:string;
}

const M3U8_PROXY = "https://m3u8proxy-kohl-one.vercel.app/?url=";

export default function AnimePlayer({ episodeId, animeId }: { episodeId: string; animeId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [availableServers, setAvailableServers] = useState<EpisodeServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<EpisodeServer | null>(null);

  // Sanitize episodeId to remove any query params that might have been passed
  const cleanEpisodeId = sanitizeFirestoreId(episodeId.split('?')[0]);

  const loadStream = useCallback(async (server: EpisodeServer) => {
    setStatus(`Contacting server: ${server.serverName}...`);
    try {
      const data = await AnimeService.getEpisodeSources(cleanEpisodeId, server.serverName);
       if (data && data.sources && data.sources.length > 0) {
              setStatus(`Source found on ${server.serverName}! Loading player...`);
              
              const proxiedSources = data.sources.map((s: any) => ({
                ...s,
                url: s.isM3U8 ? `${M3U8_PROXY}${encodeURIComponent(s.url)}` : s.url,
              }));
              const proxiedSubtitles = (data.subtitles || []).map((sub: any) => ({
                  ...sub,
                  url: `${M3U8_PROXY}${encodeURIComponent(sub.url)}`,
              }));

              setSources(proxiedSources);
              setSubtitles(proxiedSubtitles);
              setSelectedServer(server);

              // Save last working server for this specific anime
              localStorage.setItem(`last-working-server:${animeId}`, server.serverName);
              return true;
            } else {
              throw new Error("No sources returned from data");
            }
    } catch (err: any) {
        console.warn(`Server ${server.serverName} failed:`, err.message);
        setStatus(`Server ${server.serverName} failed...`);
        return false;
    }
  }, [cleanEpisodeId, animeId]);

  const findWorkingServer = useCallback(async (serverList: EpisodeServer[]) => {
      setError(null);
      for (const server of serverList) {
          const success = await loadStream(server);
          if (success) return; // Exit loop if a working server is found
      }
      setError('All servers are busy or unavailable. Please try again in 5 minutes.');
      setStatus('Playback Failed');
  }, [loadStream]);

  useEffect(() => {
    const fetchServersAndPlay = async () => {
        try {
            setStatus('Fetching available servers...');
            const serverData = await AnimeService.getEpisodeServers(cleanEpisodeId);
            const subServers = serverData.sub || [];
            const dubServers = serverData.dub || [];
            const rawServers = serverData.raw || [];

            const allServers = [...subServers, ...dubServers, ...rawServers];
            setAvailableServers(allServers);

            if (allServers.length === 0) {
                setError('Episode not available yet.');
                setStatus('Error');
                return;
            }
            
            const lastWorkingServerName = localStorage.getItem(`last-working-server:${animeId}`);
            const reorderedServers = [...allServers];

            if (lastWorkingServerName) {
                const lastWorkingServer = reorderedServers.find(s => s.serverName === lastWorkingServerName);
                if (lastWorkingServer) {
                    // Move last working server to the front of the list for faster loading
                    reorderedServers.splice(reorderedServers.indexOf(lastWorkingServer), 1);
                    reorderedServers.unshift(lastWorkingServer);
                }
            }
            await findWorkingServer(reorderedServers);

        } catch (err: any) {
            console.error("Failed to fetch servers list:", err);
            setError("Could not retrieve server list. Please refresh.");
            setStatus('Error');
        }
    }
    fetchServersAndPlay();
  }, [cleanEpisodeId, animeId, findWorkingServer]);
  
  useEffect(() => {
    if (!videoRef.current || sources.length === 0) return;

    const video = videoRef.current;
    // Prefer the highest quality source if multiple are provided
    const mainSource = sources.find(s => s.quality === '1080p') || sources.find(s => s.quality === 'default') || sources[0];
    const sourceUrl = mainSource.url;

    let hls: Hls;
    if (mainSource.isM3U8 && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => console.error("Autoplay was prevented:", e));
            setStatus('Playing');
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("HLS Fatal Error:", data);
                setError("Video stream failed. Trying another server or check your connection.");
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.error("Autoplay was prevented:", e));
            setStatus('Playing');
        });
    } else {
        video.src = sourceUrl;
        video.play().catch(e => console.error("Autoplay was prevented:", e));
        setStatus('Playing');
    }
    
     // Clear old tracks before adding new ones
    while (video.textTracks.length > 0) {
        video.textTracks[0].mode = 'disabled';
    }

    subtitles.forEach(sub => {
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = sub.lang;
        track.srclang = sub.lang.slice(0, 2);
        track.src = sub.url;
        track.default = sub.lang.toLowerCase().includes('english');
        video.appendChild(track);
    });

    return () => {
        if (hls) hls.destroy();
    };
  }, [sources, subtitles]);

  const handleServerChange = (serverName: string) => {
      const server = availableServers.find(s => s.serverName === serverName);
      if (server) {
          setSources([]); // Reset player
          setSubtitles([]);
          loadStream(server);
      }
  };

  const renderOverlay = () => {
    if (error) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center p-4 z-10">
          <ServerCrash className="w-16 h-16 text-destructive mb-4" />
          <h3 className="text-xl font-bold text-destructive">Playback Failed</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      );
    }
    if (sources.length === 0) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-semibold">{status}</p>
            </div>
        )
    }
    return null;
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} className="w-full h-full" controls playsInline crossOrigin="anonymous" />
      {renderOverlay()}
       <div className="absolute bottom-4 right-4 z-20">
          <Select onValueChange={handleServerChange} value={selectedServer?.serverName}>
              <SelectTrigger className="w-[180px] bg-card/80 border-border/50 text-white backdrop-blur-sm">
                  <Tv className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Server" />
              </SelectTrigger>
              <SelectContent>
                  {availableServers.map(server => (
                      <SelectItem key={server.serverId} value={server.serverName}>{server.serverName}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
       </div>
    </div>
  );
}
