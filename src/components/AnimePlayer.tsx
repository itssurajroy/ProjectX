
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Button } from './ui/button';
import { Loader2, ServerCrash, Tv } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AnimeService } from '@/lib/AnimeService';
import { sanitizeFirestoreId } from '@/lib/utils';
import { EpisodeServer, Source, Subtitle } from '@/types/anime';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { usePlayerSettings } from '@/store/player-settings';


function extractEpisodeNumber(episodeIdWithParam: string): string | null {
    if (!episodeIdWithParam) return null;
    const match = episodeIdWithParam.match(/[?&]ep=(\d+)/);
    return match ? match[1] : null;
}


export default function AnimePlayer({ episodeId, animeId, onNext }: { episodeId: string; animeId: string; onNext: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [availableServers, setAvailableServers] = useState<EpisodeServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<EpisodeServer | null>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  
  const episodeNumber = extractEpisodeNumber(episodeId);

  const { autoNext, autoPlay } = usePlayerSettings();

  const handleEpisodeEnd = useCallback(() => {
    if (autoNext) {
        onNext();
    }
  }, [autoNext, onNext]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('ended', handleEpisodeEnd);
    return () => {
        video.removeEventListener('ended', handleEpisodeEnd);
    }
  }, [handleEpisodeEnd]);


  const loadStream = useCallback(async (server: EpisodeServer) => {
    setStatus(`Contacting server: ${server.serverName}...`);
    try {
      const data = await AnimeService.getEpisodeSources(episodeId, server.serverName);
       if (data && data.sources && data.sources.length > 0) {
              setStatus(`Source found on ${server.serverName}! Loading player...`);
              
              setSources(data.sources);
              setSubtitles(data.subtitles || []);
              setSelectedServer(server);
              setUseIframeFallback(false);

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
  }, [episodeId, animeId]);

  const findWorkingServer = useCallback(async (serverList: EpisodeServer[]) => {
      setError(null);
      for (const server of serverList) {
          const success = await loadStream(server);
          if (success) return; 
      }
      
      setStatus('All servers busy — loading backup player...');
      console.warn('All M3U8 servers failed. Switching to MegaPlay iframe fallback.');
      setUseIframeFallback(true);
      
  }, [loadStream]);

  useEffect(() => {
    if (!episodeId) return;
    
    setSources([]);
    setSubtitles([]);
    setUseIframeFallback(false);
    setError(null);

    const fetchServersAndPlay = async () => {
        try {
            setStatus('Fetching available servers...');
            const serverData = await AnimeService.getEpisodeServers(episodeId);
            const subServers = serverData.sub || [];
            const dubServers = serverData.dub || [];
            const rawServers = serverData.raw || [];

            const allServers = [...subServers, ...dubServers, ...rawServers];
            setAvailableServers(allServers);

            if (allServers.length === 0) {
                console.log("No M3U8 servers found, trying MegaPlay directly.");
                setStatus('No servers found. Loading backup player...');
                setUseIframeFallback(true);
                return;
            }
            
            const lastWorkingServerName = localStorage.getItem(`last-working-server:${animeId}`);
            const reorderedServers = [...allServers];

            if (lastWorkingServerName) {
                const lastWorkingServer = reorderedServers.find(s => s.serverName === lastWorkingServerName);
                if (lastWorkingServer) {
                    reorderedServers.splice(reorderedServers.indexOf(lastWorkingServer), 1);
                    reorderedServers.unshift(lastWorkingServer);
                }
            }
            await findWorkingServer(reorderedServers);

        } catch (err: any) {
            console.error("Failed to fetch servers list, falling back to iframe:", err);
            setStatus('Server list unavailable. Loading backup player...');
            setUseIframeFallback(true);
        }
    }
    fetchServersAndPlay();
  }, [episodeId, animeId, findWorkingServer]);
  
  useEffect(() => {
    if (!videoRef.current || sources.length === 0 || useIframeFallback) return;

    const video = videoRef.current;
    const mainSource = sources.find(s => s.quality === '1080p') || sources.find(s => s.quality === 'default') || sources[0];
    const sourceUrl = mainSource.url;

    let hls: Hls;
    if (mainSource.isM3U8 && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        if (autoPlay) {
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.error("Autoplay was prevented:", e));
                setStatus('Playing');
            });
        }
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("HLS Fatal Error:", data);
                setError("Video stream failed. Trying another server or check your connection.");
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        if (autoPlay) {
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.error("Autoplay was prevented:", e));
                setStatus('Playing');
            });
        }
    } else {
        video.src = sourceUrl;
        if (autoPlay) {
            video.play().catch(e => console.error("Autoplay was prevented:", e));
        }
        setStatus('Playing');
    }
    
    while (video.textTracks.length > 0) {
        (video.textTracks[0] as TextTrack).mode = 'disabled';
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
  }, [sources, subtitles, useIframeFallback, autoPlay]);

  const handleServerChange = (serverName: string) => {
      const server = availableServers.find(s => s.serverName === serverName);
      if (server) {
          setSources([]); 
          setSubtitles([]);
          loadStream(server);
      }
  };

  const renderContent = () => {
    if (useIframeFallback) {
        if (!episodeNumber) {
            return (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center p-4 z-10">
                  <ServerCrash className="w-16 h-16 text-destructive mb-4" />
                  <h3 className="text-xl font-bold text-destructive">Could Not Load Backup</h3>
                  <p className="text-muted-foreground mt-2">Invalid episode ID for the backup player.</p>
                </div>
            )
        }
        const iframeUrl = `https://megaplay.buzz/stream/s-2/${episodeNumber}/sub`;
        return (
            <div className="w-full h-full relative">
                <iframe
                    src={iframeUrl}
                    allowFullScreen
                    className="w-full h-full border-0"
                    scrolling="no"
                    title="Backup Player"
                ></iframe>
                <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
                    Powered by <Link href="/" className="font-bold text-primary hover:underline">{SITE_NAME}</Link>
                </div>
             </div>
        )
    }

    return (
        <>
            <video ref={videoRef} className="w-full h-full" controls playsInline crossOrigin="anonymous" autoPlay={autoPlay} />
            {(error || sources.length === 0) && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                    {error ? (
                        <>
                             <ServerCrash className="w-16 h-16 text-destructive mb-4" />
                             <h3 className="text-xl font-bold text-destructive">Playback Failed</h3>
                             <p className="text-muted-foreground mt-2">{error}</p>
                        </>
                    ) : (
                        <>
                           <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                           <p className="text-lg font-semibold">{status}</p>
                        </>
                    )}
                </div>
            )}
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
        </>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {renderContent()}
    </div>
  );
}

    