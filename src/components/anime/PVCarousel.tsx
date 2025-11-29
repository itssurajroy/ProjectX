
'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PromotionalVideo } from "@/types/anime";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function PVCarousel({ videos }: { videos: PromotionalVideo[] }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-primary pl-3">Promotional Videos</h2>
            <Carousel 
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {videos.map((video, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <a href={video.source} target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
                                    {video.thumbnail ? (
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title || `Promotional Video ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : <div className="w-full h-full bg-muted"></div>}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <PlayCircle className="w-12 h-12 text-white/80 transition-all group-hover:text-white group-hover:scale-110" />
                                    </div>
                                    {video.title && (
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                            <p className="text-white font-semibold text-sm truncate">{video.title}</p>
                                        </div>
                                    )}
                                </div>
                            </a>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    );
}
