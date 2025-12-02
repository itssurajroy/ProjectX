
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PromotionalVideo } from '@/types/anime';
import Image from 'next/image';
import { PlayCircle } from "lucide-react";

interface PVCarouselProps {
  videos: PromotionalVideo[];
}

// Helper to get high-res YouTube thumbnail
const getYoutubeThumbnail = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
}


export default function PVCarousel({ videos }: PVCarouselProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  const openVideo = (url?: string) => {
    if (url) window.open(url, '_blank');
  }

  return (
    <section>
      <h2 className="text-title font-bold mb-4 border-l-4 border-primary pl-3">Promotional Videos</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {videos.map((video, index) => {
            const youtubeThumbnail = getYoutubeThumbnail(video.source);
            return (
              <CarouselItem key={index} className="md:basis-1/2">
                <div 
                  className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => openVideo(video.source)}
                >
                  <Image
                    src={youtubeThumbnail || video.thumbnail || "https://picsum.photos/seed/pv-fallback/480/270"}
                    alt={video.title || `Promotional Video ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
                  </div>
                  {video.title && (
                      <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white text-sm font-semibold truncate">{video.title}</p>
                      </div>
                  )}
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-card/80 hover:bg-card" />
        <CarouselNext className="right-2 bg-card/80 hover:bg-card" />
      </Carousel>
    </section>
  );
}
