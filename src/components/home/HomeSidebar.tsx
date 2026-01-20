'use client';
import { AnimeBase, Top10Anime } from "@/lib/types/anime";
import Link from 'next/link';
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressiveImage from "../ProgressiveImage";

const GenresList = ({ genres }: { genres: string[] }) => (
    <div className="bg-card/50 p-4 rounded-lg border border-border/50">
        <h3 className="font-bold text-lg mb-3">Genres</h3>
        <div className="grid grid-cols-2 gap-2">
            {genres.slice(0, 12).map(genre => (
                <Link key={genre} href={`/search?genres=${genre.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors py-1">{genre}</Link>
            ))}
        </div>
        <Button variant="link" className="mt-2 p-0 h-auto">View More</Button>
    </div>
);

const MostViewedList = ({ animes, title }: { animes: Top10Anime[], title: string }) => (
    <div className="space-y-3">
        {animes.slice(0, 7).map(anime => (
            <Link key={anime.id} href={`/anime/${anime.id}`} className="flex items-center gap-3 group">
                <div className="text-3xl font-black text-muted-foreground/30 w-8 text-center">{String(anime.rank).padStart(2, '0')}</div>
                <div className="relative w-12 h-16 flex-shrink-0">
                    <ProgressiveImage src={anime.poster} alt={anime.name} fill className="object-cover rounded-md" />
                </div>
                <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{anime.name}</p>
                    <p className="text-xs text-muted-foreground">{anime.episodes?.sub || '?'} episodes</p>
                </div>
            </Link>
        ))}
    </div>
)

export default function HomeSidebar({ genres, topToday, topWeek, topMonth }: { genres: string[], topToday: Top10Anime[], topWeek: Top10Anime[], topMonth: Top10Anime[] }) {
    return (
        <aside className="space-y-8 sticky top-24">
            <GenresList genres={genres} />

             <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                <h3 className="font-bold text-lg mb-3">Most Viewed</h3>
                <Tabs defaultValue="week" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                    <TabsContent value="today" className="mt-4">
                        <MostViewedList animes={topToday} title="Today" />
                    </TabsContent>
                    <TabsContent value="week" className="mt-4">
                        <MostViewedList animes={topWeek} title="Week" />
                    </TabsContent>
                    <TabsContent value="month" className="mt-4">
                        <MostViewedList animes={topMonth} title="Month" />
                    </TabsContent>
                </Tabs>
             </div>
        </aside>
    )
}
