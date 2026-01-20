
'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import { HomeData } from '@/lib/types/anime';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProgressiveImage from '@/components/ProgressiveImage';
import { Shield, Clapperboard, Bookmark, Tv, Sparkles, Wind } from 'lucide-react';
import { AnimeCard } from '@/components/AnimeCard';
import { motion } from 'framer-motion';
import Balancer from 'react-wrap-balancer';
import { SITE_NAME } from '@/lib/constants';

const features = [
  {
    icon: <Tv className="w-8 h-8 text-primary" />,
    title: 'HD Streaming',
    description: 'Enjoy your favorite anime in crisp high-definition quality, with support for up to 1080p.',
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: 'Ad-Free Experience',
    description: 'Immerse yourself completely without any interruptions. We believe in a seamless viewing experience.',
  },
  {
    icon: <Bookmark className="w-8 h-8 text-primary" />,
    title: 'Personal Watchlist',
    description: 'Keep track of what you’re watching, what you’ve completed, and what you plan to watch next.',
  },
];

export default function LandingPage() {
    const { data: homeData, isLoading } = useQuery<HomeData>({
        queryKey: ['homeDataForLanding'],
        queryFn: AnimeService.home,
    });

    const trendingAnimes = homeData?.trendingAnimes || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <ProgressiveImage
                        src="https://picsum.photos/seed/landing-hero/1920/1080"
                        alt="Anime Collage"
                        fill
                        priority
                        className="object-cover opacity-20 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10 px-4"
                >
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-glow tracking-tight uppercase">
                        <Balancer>Enter Your Anime Domain.</Balancer>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                        <Balancer>
                            Discover and stream thousands of anime series and movies. Ad-free, in high definition, and on any device. Your next great adventure is just a click away.
                        </Balancer>
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base">
                            <Link href="/tv">Start Watching</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                            <Link href="/dashboard">My Dashboard</Link>
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="inline-block p-4 bg-primary/10 rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                            <p className="text-muted-foreground mt-2">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
            
            {/* Trending Section */}
            {trendingAnimes.length > 0 && (
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                     <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-primary" />
                        Trending Now
                    </h2>
                     <div className="grid-cards">
                        {trendingAnimes.slice(0, 12).map((anime, index) => (
                             <motion.div
                                key={anime.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                             >
                                <AnimeCard anime={anime} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold">Ready to Start Your Adventure?</h2>
                <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                    Create a free account to build your watchlist, track your progress, and join the community.
                </p>
                <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
                    <Link href="/login">Join {SITE_NAME} Today</Link>
                </Button>
            </section>

        </div>
    );
}
