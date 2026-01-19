'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function AdminCommentsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Comments & Reviews</h1>
                <p className="text-muted-foreground">Manage all user-submitted comments and reviews.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This section is being developed. Soon you'll be able to moderate, edit, and search through all comments and reviews here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
