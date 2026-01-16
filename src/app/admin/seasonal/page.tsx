'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSeasonalPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Seasonal & Airing Tools</h1>
                <p className="text-muted-foreground">Manage current season, promote anime, and pull upcoming shows.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Current Season Hub</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The seasonal editor will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
