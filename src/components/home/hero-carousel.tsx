'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import Link from 'next/link';
import { heroItems } from '@/lib/data';
import { Button } from '../ui/button';
import { PlayCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [_, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full aspect-video md:aspect-[2.4/1] group">
       <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className='h-full'>
          {heroItems.map((item, index) => (
            <CarouselItem key={index} className='h-full'>
              <Card className="border-none rounded-none h-full">
                <CardContent className="relative flex h-full items-center justify-center p-0">
                  <Image
                    src={item.image.imageUrl}
                    alt={item.title}
                    fill
                    loading={index === 0 ? 'eager' : 'lazy'}
                    priority={index === 0}
                    data-ai-hint={item.image.imageHint}
                    className="object-cover brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="relative z-10 text-white container mx-auto px-4 max-w-4xl space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">{item.title}</h2>
                    <p className="text-sm md:text-lg text-white/80 max-w-2xl line-clamp-3">{item.description}</p>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href={item.link}>
                        <PlayCircle className="mr-2 h-5 w-5" /> Watch Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 w-8 rounded-full transition-colors",
              current === index ? "bg-primary" : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
