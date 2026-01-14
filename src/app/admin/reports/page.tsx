'use client';
import { Card, CardContent } from "@/components/ui/card";

export default function AdminReportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Moderation - Reports</h1>
                <p className="text-muted-foreground">Manage user reports for content and behavior.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Reports Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The reports queue will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
