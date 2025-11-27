'use client';

import { 
  Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings, Captions, Info
} from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimeAbout, AnimeEpisode, EpisodeServer, EpisodeSourcesResponse } from "@/types/anime";
import { AnimeService } from "@/lib/AnimeService";
import { useQuery } from "@tanstack/react-query";

type VideoPlayerProps = {
  anime: AnimeAbout;
  episode: AnimeEpisode | null;
}

export default function VideoPlayer({ anime, episode }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSource, setActiveSource] = useState<'sub' | 'dub' | 'raw'>('sub');

  const { data: serversResponse, isLoading: isLoadingServers } = useQuery({
    queryKey: ['episodeServers', episode?.episodeId],
    queryFn: () => AnimeService.getEpisodeServers(episode!.episodeId),
    enabled: !!episode,
  });

  const servers = serversResponse && 'data' in serversResponse ? serversResponse.data : { sub: [], dub: [], raw: [] };
  
  const [selectedServer, setSelectedServer] = useState<EpisodeServer | null>(null);

  useEffect(() => {
    if (servers && servers[activeSource] && servers[activeSource].length > 0) {
      setSelectedServer(servers[activeSource][0]);
    } else {
      setSelectedServer(null);
    }
  }, [servers, activeSource]);
  
  const { data: sourcesResponse, isLoading: isLoadingSources } = useQuery<EpisodeSourcesResponse | { success: false, error: string }>({
      queryKey: ['episodeSources', episode?.episodeId, selectedServer?.serverId, activeSource],
      queryFn: () => AnimeService.getEpisodeSources(episode!.episodeId, selectedServer!.serverName, activeSource),
      enabled: !!episode && !!selectedServer,
  });


  if (!episode) {
    return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player flex items-center justify-center">
            <p className="text-muted-foreground">Select an episode to begin.</p>
        </div>
    )
  }

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player">
      {isLoadingSources && <div className="w-full h-full flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>}
      {sourcesResponse && 'sources' in sourcesResponse && sourcesResponse.sources?.[0]?.url ? (
        <video src={sourcesResponse.sources[0].url} className="w-full h-full" controls autoPlay/>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Could not load video. Try another server.</p>
        </div>
      )}


      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
          <h3 className="text-white font-semibold text-lg">{anime.info.name} - {episode.title}</h3>
           <div className="flex items-center gap-2">
            {(['sub', 'dub', 'raw'] as const).map(source => (
              servers[source].length > 0 &&
              <Button 
                key={source}
                size="sm"
                variant={activeSource === source ? 'default' : 'secondary'}
                onClick={() => setActiveSource(source)}
                className={cn("h-8 capitalize", activeSource === source && "bg-primary text-primary-foreground")}
              >
                {source}
              </Button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 pointer-events-auto">
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
                        <PopoverContent className="w-48 bg-background/80 backdrop-blur-sm border-slate-700 text-foreground">
                            <div className="grid gap-2">
                                <h4 className="font-medium leading-none mb-2">Servers</h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {servers[activeSource].map(server => (
                                    <Button key={server.serverId} variant={selectedServer?.serverId === server.serverId ? 'default' : 'secondary'} size="sm" onClick={() => setSelectedServer(server)}>
                                      {server.serverName}
                                    </Button>
                                  ))}
                                </div>
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
