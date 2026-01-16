'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminImportExportPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Import / Export Tools</h1>
                <p className="text-muted-foreground">Bulk manage anime data and user lists.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Import Anime Data</CardTitle>
                        <CardDescription>Bulk import from JSON/CSV (MyAnimeList compatible).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled>Select File...</Button>
                        <p className="text-xs text-muted-foreground mt-2">Feature coming soon.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Backup & Maintenance</CardTitle>
                        <CardDescription>Export collections or clear system cache.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                             <h4 className="font-semibold mb-2">Export Firestore Data</h4>
                             <Button disabled className="gap-2"><Download className="w-4 h-4"/> Export User Data (JSON)</Button>
                             <p className="text-xs text-muted-foreground mt-2">Full collection exports coming soon.</p>
                        </div>
                         <div>
                             <h4 className="font-semibold mb-2">Cache Management</h4>
                             <Button disabled>Clear All Caches</Button>
                             <p className="text-xs text-muted-foreground mt-2">Revalidate Next.js pages.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
