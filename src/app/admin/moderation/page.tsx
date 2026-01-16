'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminModerationPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Moderation Queue</h1>
                <p className="text-muted-foreground">Manage pending reviews, comments, and reported content.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Reports Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The reports and moderation queue will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
