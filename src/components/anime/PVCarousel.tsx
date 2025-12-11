
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PromotionalVideo } from '@/types/anime';
import { PlayCircle } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface PVCarouselProps {
  videos: PromotionalVideo[];
  fallbackPoster: string;
}

export default function PVCarousel({ videos, fallbackPoster }: PVCarouselProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  const openVideo = (url?: string) => {
    if (url) window.open(url, '_blank');
  }

  return (
    <section>
      <h2 className="text-title mb-4 border-l-4 border-primary pl-3">Promotional Videos</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {videos.map((video, index) => (
            <CarouselItem key={index} className="md:basis-1/2">
              <div 
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openVideo(video.source)}
              >
                <CldImage
                  src={video.thumbnail || fallbackPoster}
                  alt={video.title || `Promotional Video ${index + 1}`}
                  fill
                  crop="fill"
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
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-card/80 hover:bg-card" />
        <CarouselNext className="right-2 bg-card/80 hover:bg-card" />
      </Carousel>
    </section>
  );
}
