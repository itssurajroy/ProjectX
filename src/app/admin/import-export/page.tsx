'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminImportExportPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Import / Export Tools</h1>
                <p className="text-muted-foreground">Bulk manage anime data and user lists.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Import Anime</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The bulk import tool (JSON/CSV) will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
