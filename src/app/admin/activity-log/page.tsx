'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminActivityLogPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Activity Log</h1>
                <p className="text-muted-foreground">Track important actions performed by admins and moderators.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A searchable log of all administrative actions will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
