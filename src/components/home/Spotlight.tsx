
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpotlightAnime } from '@/lib/types/anime';
import { cn } from '@/lib/utils';
import Balancer from 'react-wrap-balancer';

interface SpotlightProps {
  animes: SpotlightAnime[];
}

const Spotlight = ({ animes }: SpotlightProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animes.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [animes.length]);

  const currentAnime = animes[currentIndex];
  if (!currentAnime) return null;

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] -mt-16 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <Image
            src={currentAnime.poster}
            alt={currentAnime.name}
            fill
            className="object-cover opacity-20"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />

      <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-20">
        <motion.div
            key={`${currentIndex}-content`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl"
        >
            <p className="text-primary text-glow-sm font-semibold">#{currentAnime.rank} Spotlight</p>
            <h1 className="text-3xl md:text-5xl font-bold mt-2 text-glow">
                <Balancer>{currentAnime.name}</Balancer>
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                {currentAnime.otherInfo.map(info => <span key={info}>{info}</span>)}
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4 max-w-xl text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: currentAnime.description }} />
            
            <div className="flex gap-4 mt-6">
                <Button asChild size="lg" className="shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
                    <Link href={`/watch/${currentAnime.id}`}>
                        <Play className="w-5 h-5 mr-2" /> Watch Now
                    </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="transform hover:scale-105 transition-transform bg-white/10 hover:bg-white/20">
                     <Link href={`/anime/${currentAnime.id}`}>
                        <Info className="w-5 h-5 mr-2" /> Details
                    </Link>
                </Button>
            </div>
        </motion.div>
      </div>

       <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            {animes.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        index === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-white/50 hover:bg-white/80'
                    )}
                />
            ))}
        </div>
    </div>
  );
};

export default Spotlight;
