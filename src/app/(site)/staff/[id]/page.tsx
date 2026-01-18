
'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimeService } from '@/lib/services/AnimeService';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import ProgressiveImage from '@/components/ProgressiveImage';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock types
interface StaffDetails {
    id: string;
    name: string;
    poster: string;
    description: string;
    roles: {
        character: {
            id: string;
            name: string;
            poster: string;
        };
        anime: {
            id: string;
            name: string;
        }
    }[];
}

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
                <Skeleton className="w-48 h-48 rounded-full mx-auto" />
            </div>
            <div className="md:col-span-9 space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-1/4 mt-8" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                 </div>
            </div>
        </div>
    </div>
)

const RoleCard = ({ role }: { role: StaffDetails['roles'][0] }) => (
    <div className="bg-card/50 rounded-lg overflow-hidden flex border border-border/50 hover:border-primary/50 transition-colors">
        <Link href={`/character/${role.character.id}`} className="w-1/2 flex items-center gap-3 p-3 hover:bg-muted/30">
            <div className="relative aspect-[2/3] w-12 flex-shrink-0">
                <ProgressiveImage src={role.character.poster} alt={role.character.name} fill className="object-cover rounded-md" />
            </div>
            <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-primary truncate">{role.character.name}</h4>
                <p className="text-xs text-muted-foreground">Character</p>
            </div>
        </Link>
        <Link href={`/anime/${role.anime.id}`} className="w-1/2 flex items-center gap-3 p-3 bg-muted/30 justify-end text-right hover:bg-muted/50">
            <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{role.anime.name}</p>
                <p className="text-xs text-muted-foreground">Anime</p>
            </div>
        </Link>
    </div>
)

export default function StaffPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: staff, isLoading, error, refetch } = useQuery<StaffDetails>({
        queryKey: ['staff', id],
        queryFn: () => AnimeService.getStaffDetails(id),
    });

    if (isLoading) return <LoadingSkeleton />;
    if (error || !staff) return <ErrorDisplay onRetry={refetch} title="Failed to load staff details." />;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
             <div className="mb-6">
                <Breadcrumb items={[
                    { label: 'Home', href: '/home' },
                    { label: 'Staff', href: '#' },
                    { label: staff.name }
                ]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <aside className="md:col-span-3 flex flex-col items-center">
                    <ProgressiveImage
                        src={staff.poster}
                        alt={staff.name}
                        className="rounded-full shadow-lg w-48 h-48"
                        width={200}
                        height={200}
                    />
                </aside>
                <main className="md:col-span-9">
                    <h1 className="text-4xl font-bold font-display text-glow">{staff.name}</h1>
                    <p className="text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: staff.description }} />

                    <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-primary pl-3">Voice Acting Roles</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {staff.roles.map(role => (
                            <RoleCard key={`${role.anime.id}-${role.character.id}`} role={role} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
