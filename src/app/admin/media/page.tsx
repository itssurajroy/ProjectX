'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function AdminMediaPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Media Library</h1>
                <p className="text-muted-foreground">Manage uploaded images and other media assets.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A file browser and management interface for your media assets will be implemented here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
