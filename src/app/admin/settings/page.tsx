'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground">Configure system-wide settings, feature flags, and integrations.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Feature flag management will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
