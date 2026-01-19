'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileWarning } from 'lucide-react';

export default function AdminReportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">View generated reports and analytics on moderation and platform usage.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will contain downloadable reports and data visualizations for various platform metrics.</p>
                </CardContent>
            </Card>
        </div>
    );
}
