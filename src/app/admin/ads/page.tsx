'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function AdminAdsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Advertisement Management</h1>
                <p className="text-muted-foreground">Manage ad slots and campaigns.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section will contain tools to manage banner ads, video pre-roll, and other advertising configurations.</p>
                </CardContent>
            </Card>
        </div>
    );
}
