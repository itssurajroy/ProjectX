
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

export default function PVCarousel({ videos }: PVCarouselProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  const openVideo = (url?: string) => {
    if (url) window.open(url, '_blank');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-display">Promotional Videos</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {videos.map((video, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div 
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openVideo(video.source)}
              >
                <Image
                  src={video.thumbnail || "https://picsum.photos/seed/pv-fallback/480/270"}
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
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
