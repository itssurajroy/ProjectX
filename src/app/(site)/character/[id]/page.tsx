
'use client';
import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import ProgressiveImage from '@/components/ProgressiveImage';
import { AnimeCard } from '@/components/AnimeCard';
import Breadcrumb from '@/components/common/Breadcrumb';
import { useParams } from 'next/navigation';

// This is a mock type. In a real scenario, this would come from a dedicated types file.
interface CharacterDetails {
    id: string;
    name: string;
    poster: string;
    description: string;
    anime: {
        id: string;
        name: string;
        poster: string;
        type: string;
    }[];
}

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
                <Skeleton className="aspect-[2/3] w-full" />
            </div>
            <div className="md:col-span-9 space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-1/4 mt-8" />
                <div className="grid-cards">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                             <Skeleton className="aspect-[2/3] w-full" />
                             <Skeleton className="h-4 w-4/5" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export default function CharacterPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: character, isLoading, error, refetch } = useQuery<CharacterDetails>({
        queryKey: ['character', id],
        queryFn: () => AnimeService.getCharacterDetails(id),
    });

    if (isLoading) return <LoadingSkeleton />;
    if (error || !character) return <ErrorDisplay onRetry={refetch} title="Failed to load character details." />;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="mb-6">
                <Breadcrumb items={[
                    { label: 'Home', href: '/' },
                    { label: 'Characters', href: '#' },
                    { label: character.name }
                ]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <aside className="md:col-span-3">
                    <ProgressiveImage
                        src={character.poster}
                        alt={character.name}
                        className="rounded-lg shadow-lg aspect-[2/3] w-full"
                        width={300}
                        height={450}
                    />
                </aside>
                <main className="md:col-span-9">
                    <h1 className="text-4xl font-bold font-display text-glow">{character.name}</h1>
                    <p className="text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: character.description }} />

                    <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-primary pl-3">Anime Appearances</h2>
                    <div className="grid-cards">
                        {character.anime.map(anime => (
                            <AnimeCard key={anime.id} anime={anime as any} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
