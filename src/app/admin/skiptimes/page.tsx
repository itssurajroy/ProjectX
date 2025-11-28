
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SkipTimesPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search for Anime Episode</CardTitle>
                    <CardDescription>Find an episode by Anime ID and episode number.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input placeholder="Anime ID (e.g., one-piece-100)" />
                    <Input type="number" placeholder="Episode Number" />
                    <Button><Search className="w-4 h-4 mr-2" /> Search</Button>
                    <Button variant="outline">Bulk Import Timestamps</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skip Times for: One Piece - Episode 1089</CardTitle>
                    <CardDescription>All times are in seconds.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Intro Start</Label>
                            <Input type="number" placeholder="e.g., 65" />
                        </div>
                        <div className="space-y-2">
                            <Label>Intro End</Label>
                            <Input type="number" placeholder="e.g., 155" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Outro Start</Label>
                            <Input type="number" placeholder="e.g., 1290" />
                        </div>
                        <div className="space-y-2">
                            <Label>Outro End</Label>
                            <Input type="number" placeholder="e.g., 1380" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="auto-skip-enabled" />
                        <Label htmlFor="auto-skip-enabled">Auto-skip enabled for this episode</Label>
                    </div>

                     <div className="flex items-center space-x-2 pt-2">
                        <Switch id="is-broken" />
                        <Label htmlFor="is-broken">Mark episode as "Broken"</Label>
                    </div>

                     <div className="space-y-2 pt-2">
                        <Label>Force Server Priority</Label>
                         <Input placeholder="megacloud, vidplay, hls" />
                         <p className="text-xs text-muted-foreground">Comma-separated list of server names.</p>
                    </div>

                    <div className="flex justify-end">
                        <Button>Save Timestamps</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
