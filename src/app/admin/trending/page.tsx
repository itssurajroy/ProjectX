'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function AdminTrendingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Trending & Featured</h1>
                <p className="text-muted-foreground">Manually override or adjust trending and featured content.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will allow you to pin anime to the homepage, adjust trending algorithms, and manage featured sections.</p>
                </CardContent>
            </Card>
        </div>
    );
}
