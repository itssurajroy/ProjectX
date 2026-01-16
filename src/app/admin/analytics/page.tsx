'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">View user growth, top anime, and genre statistics.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Charts for top anime, user growth, and genre stats will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
