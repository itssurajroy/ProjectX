'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Film, PlusCircle, Search } from "lucide-react";

const placeholderAnime = [
    { id: '1', title: 'Jujutsu Kaisen', type: 'TV', status: 'Airing', episodes: 24, available: 24, poster: 'https://picsum.photos/seed/jujutsu/200/300' },
    { id: '2', title: 'Solo Leveling', type: 'TV', status: 'Airing', episodes: 12, available: 12, poster: 'https://picsum.photos/seed/solo/200/300' },
    { id: '3', title: 'One Piece', type: 'TV', status: 'Airing', episodes: 1100, available: 1100, poster: 'https://picsum.photos/seed/onepiece/200/300' },
    { id: '4', title: 'Frieren: Beyond Journey\'s End', type: 'TV', status: 'Completed', episodes: 28, available: 28, poster: 'https://picsum.photos/seed/frieren/200/300' },
]

export default function AdminAnimePage() {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Anime Management</h1>
                <p className="text-muted-foreground">Create, edit, and manage all anime content.</p>
            </div>

            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by title, ID, or external ID..." className="pl-10" />
                </div>
                <Button className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Add New Anime
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="p-4 text-left font-semibold">Title</th>
                                    <th className="p-4 text-left font-semibold">Type</th>
                                    <th className="p-4 text-left font-semibold">Status</th>
                                    <th className="p-4 text-left font-semibold">Episodes</th>
                                    <th className="p-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {placeholderAnime.map(anime => (
                                    <tr key={anime.id} className="border-b last:border-b-0">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={anime.poster} alt={anime.title} className="w-10 h-14 object-cover rounded-md" />
                                            <span>{anime.title}</span>
                                        </td>
                                        <td className="p-4">{anime.type}</td>
                                        <td className="p-4">{anime.status}</td>
                                        <td className="p-4">{anime.available} / {anime.episodes}</td>
                                        <td className="p-4">
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
