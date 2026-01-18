'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimeService } from "@/lib/services/AnimeService";
import { AnimeBase, SearchResult } from "@/lib/types/anime";
import { useQuery } from "@tanstack/react-query";
import { Film, Loader2, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import ProgressiveImage from "@/components/ProgressiveImage";

export default function AdminAnimePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');

    const { data: searchResult, isLoading, error } = useQuery<{data: SearchResult}>({
        queryKey: ['admin-anime-search', query],
        queryFn: () => {
            const params = new URLSearchParams({ q: query });
            return AnimeService.search(params);
        },
        enabled: !!query,
    });

    const animes = searchResult?.data?.animes || [];

    const handleSearch = () => {
        if (searchTerm.trim()) {
            setQuery(searchTerm.trim());
        }
    }

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Anime Management</h1>
                <p className="text-muted-foreground">Create, edit, and manage all anime content.</p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by title, ID, or external ID..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSearch} disabled={!searchTerm.trim()}>Search</Button>
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Add New Anime
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="p-4 text-left font-semibold">Title</th>
                                    <th className="p-4 text-left font-semibold">Type</th>
                                    <th className="p-4 text-left font-semibold">Duration</th>
                                    <th className="p-4 text-left font-semibold">Episodes</th>
                                    <th className="p-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                         <td colSpan={5} className="text-center p-8 text-destructive">
                                            Error fetching anime: {error.message}
                                        </td>
                                    </tr>
                                ) : animes.length > 0 ? (
                                    animes.map((anime: AnimeBase) => (
                                    <tr key={anime.id} className="border-b last:border-b-0">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-10 h-14 relative flex-shrink-0">
                                                <ProgressiveImage 
                                                    src={anime.poster} 
                                                    alt={anime.name}
                                                    width={40}
                                                    height={56}
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                            <span>{anime.name}</span>
                                        </td>
                                        <td className="p-4">{anime.type || 'N/A'}</td>
                                        <td className="p-4">{anime.duration || 'N/A'}</td>
                                        <td className="p-4">{anime.episodes?.sub || 'N/A'}</td>
                                        <td className="p-4">
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                            {query ? 'No results found.' : 'Search for an anime to manage.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
