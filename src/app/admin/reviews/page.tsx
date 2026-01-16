'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReviewsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Moderation - Reviews</h1>
                <p className="text-muted-foreground">Manage user reports for comments and reviews.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Moderation Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The reviews and reports queue will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
