
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { setAnimeOverride } from "@/lib/admin/overrides";
import toast from "react-hot-toast";


export default function OverridesPage() {

    const handleLinkMal = async () => {
        const animeId = "one-piece"; // This should be dynamic based on search
        const malId = prompt("Enter the MyAnimeList ID for this anime:");
        if (malId && !isNaN(Number(malId))) {
            try {
                // @ts-ignore
                await setAnimeOverride(animeId, { malId: Number(malId) });
            } catch(e) {
                // error is handled by the global handler
            }
        } else if (malId) {
            toast.error("Invalid MAL ID. Please enter a number.");
        }
    }


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search for Anime</CardTitle>
                    <CardDescription>Find an anime by its ID or title to create or edit an override.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input placeholder="Search by Anime ID or Title..."/>
                    <Button><Search className="w-4 h-4 mr-2"/> Search</Button>
                    <Button variant="default">Create New Override</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Override Anime: One Piece</CardTitle>
                    <CardDescription>Current values are shown. Modify any field to override the data from the API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>English Title</Label>
                            <Input defaultValue="One Piece" />
                        </div>
                        <div className="space-y-2">
                            <Label>Japanese Title</Label>
                            <Input defaultValue="ワンピース" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Synopsis</Label>
                        <Textarea defaultValue="Gol D. Roger was known as the 'Pirate King'..." />
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Poster URL</Label>
                            <Input defaultValue="https://cdn.myanimelist.net/images/anime/1244/138851.jpg" />
                        </div>
                        <div className="space-y-2">
                            <Label>Banner URL</Label>
                            <Input placeholder="Leave blank to use default" />
                        </div>
                    </div>
                     <div className="grid md:grid-cols-3 gap-4">
                         <div className="space-y-2">
                            <Label>Status</Label>
                            <Select defaultValue="ongoing">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Episode Count</Label>
                            <Input type="number" defaultValue="1111" />
                        </div>
                         <div className="space-y-2">
                            <Label>Genres</Label>
                            <Input defaultValue="Action, Adventure, Fantasy" />
                            <p className="text-xs text-muted-foreground">Comma-separated values.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Tags & Pinning</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            {['Trending', 'Recommended', 'Exclusive', '4K', 'Uncensored', 'Spotlight', 'New Release', 'Hidden'].map(tag => (
                                <div key={tag} className="flex items-center gap-2">
                                    <Checkbox id={`tag-${tag}`}/>
                                    <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                         <Button variant="outline" onClick={handleLinkMal}>Link to MAL</Button>
                         <Button variant="destructive">Block Anime</Button>
                        <Button>Save Override</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
