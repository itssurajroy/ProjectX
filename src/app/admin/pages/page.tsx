'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Files } from "lucide-react";

export default function AdminPagesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Pages Management</h1>
                <p className="text-muted-foreground">Create and manage static pages like 'About Us' or 'Contact'.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A simple CMS for managing static page content will be available here soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
