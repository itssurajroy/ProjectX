
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Button } from './ui/button';
import { Loader2, ServerCrash, Tv } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { AnimeEpisode } from '@/types/anime';

const M3U8_PROXY = 'https://m3u8proxy-kohl-one.vercel.app/?url=';

interface Source {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

interface Subtitle {
  lang: string;
  url:string;
}

const servers = [
  { name: "HD-1", id: "hd-1" },
  { name: "VidStreaming", id: "vidstreaming" },
  { name: "MegaCloud", id: "megacloud" },
  { name: "StreamWish", id: "streamwish" },
  { name: "FileMoon", id: "filemoon" },
];

async function getSources(episodeId: string, serverId: string, category: 'sub' | 'dub') {
    const res = await fetch(`/api/stream/episode/sources?animeEpisodeId=${episodeId}&server=${serverId}&category=${category}`);
    if (!res.ok) throw new Error(`Server ${serverId} failed with status ${res.status}`);
    const json = await res.json();
    if (json.success === false || !json.data?.sources?.length) {
        throw new Error(json.message || `No sources found on ${serverId}`);
    }
    return json.data;
}

export default function AnimePlayer({ episodeId, category = 'sub', animeId }: { episodeId: string; category?: 'sub' | 'dub', animeId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>('');

  const cleanEpisodeId = episodeId.split('?')[0];

  const loadPlayer = useCallback(async (serverList: typeof servers) => {
    setError(null);
    for (const server of serverList) {
        try {
            setStatus(`Contacting server: ${server.name}...`);
            const data = await getSources(cleanEpisodeId, server.id, category);
            
            setStatus(`Source found on ${server.name}! Loading player...`);
            
            const proxiedSources = data.sources.map((s: Source) => ({
                ...s,
                url: s.isM3U8 || s.url.includes('.m3u8') ? `${M3U8_PROXY}${encodeURIComponent(s.url)}` : s.url,
            }));
            
            const proxiedSubtitles = (data.subtitles || []).map((sub: Subtitle) => ({
                ...sub,
                url: `${M3U8_PROXY}${encodeURIComponent(sub.url)}`
            }));

            setSources(proxiedSources);
            setSubtitles(proxiedSubtitles);
            setSelectedServer(server.id);

            // Save last working server
            localStorage.setItem(`last-working-server:${animeId}`, server.id);
            return; // Success, exit loop
        } catch (err: any) {
            console.warn(`Server ${server.name} failed:`, err.message);
            setStatus(`Server ${server.name} failed, trying next...`);
        }
    }
    setError('All servers failed to provide a video source. Please try again later.');
    setStatus('Playback Failed');
  }, [cleanEpisodeId, category, animeId]);

  useEffect(() => {
    const lastWorkingServerId = localStorage.getItem(`last-working-server:${animeId}`);
    const reorderedServers = [...servers];

    if (lastWorkingServerId) {
        const lastWorkingServer = reorderedServers.find(s => s.id === lastWorkingServerId);
        if (lastWorkingServer) {
            // Move last working server to the front
            reorderedServers.splice(reorderedServers.indexOf(lastWorkingServer), 1);
            reorderedServers.unshift(lastWorkingServer);
        }
    }
    loadPlayer(reorderedServers);
  }, [cleanEpisodeId, animeId, loadPlayer]);
  
  useEffect(() => {
    if (!videoRef.current || sources.length === 0) return;

    const video = videoRef.current;
    const hlsUrl = sources[0].url;

    let hls: Hls;
    if (Hls.isSupported()) {
        hls = new Hls({
            xhrSetup: (xhr) => {
              xhr.setRequestHeader("Referer", "https://hianime.to");
            },
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => console.error("Autoplay prevented:", e));
            setStatus('Playing');
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("HLS Fatal Error:", data);
                setError("A fatal error occurred with the stream. Please try another server.");
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.error("Autoplay prevented:", e));
            setStatus('Playing');
        });
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

  const handleServerChange = (serverId: string) => {
      const server = servers.find(s => s.id === serverId);
      if (server) {
          setSources([]); // Reset player
          setSubtitles([]);
          loadPlayer([server]);
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
      <video ref={videoRef} className="w-full h-full" controls playsInline />
      {renderOverlay()}
       <div className="absolute bottom-4 right-4 z-20">
          <Select onValueChange={handleServerChange} value={selectedServer}>
              <SelectTrigger className="w-[180px] bg-card/80 border-border/50 text-white backdrop-blur-sm">
                  <Tv className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Server" />
              </SelectTrigger>
              <SelectContent>
                  {servers.map(server => (
                      <SelectItem key={server.id} value={server.id}>{server.name}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
       </div>
    </div>
  );
}
