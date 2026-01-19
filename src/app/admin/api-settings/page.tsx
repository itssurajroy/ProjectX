'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plug } from "lucide-react";

export default function AdminApiSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">API Integration</h1>
                <p className="text-muted-foreground">Manage API keys and integration settings.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will be used to manage API keys for external services (e.g., MAL, AniList) and configure webhook endpoints.</p>
                </CardContent>
            </Card>
        </div>
    );
}
