'use client';

import { useState } from "react";
import { AnimeAbout, AnimeEpisode } from "@/types/anime";
import { Loader2 } from "lucide-react";

type VideoPlayerProps = {
  anime: AnimeAbout;
  episode: AnimeEpisode | undefined;
}

export default function VideoPlayer({ anime, episode }: VideoPlayerProps) {
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

  if (!episode) {
    return (
        <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player flex items-center justify-center">
            <p className="text-muted-foreground">Select an episode to begin.</p>
        </div>
    )
  }

  // The hianime episode ID is just the `ep` query param value, not the full episodeId string from the API.
  const episodeNumberId = episode.episodeId.split('?ep=')[1];

  const iframeSrc = `https://megaplay.buzz/stream/s-2/${episodeNumberId}/${language}`;

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden group/player">
        <iframe
            key={iframeSrc}
            src={iframeSrc}
            allowFullScreen
            className="w-full h-full"
            scrolling="no"
            frameBorder="0"
        ></iframe>
    </div>
  );
}
