'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu } from "lucide-react";

export default function AdminMenusPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Menu Management</h1>
                <p className="text-muted-foreground">Control the navigation menus for the header and footer.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A drag-and-drop interface for managing your site's navigation menus is planned for this section.</p>
                </CardContent>
            </Card>
        </div>
    );
}
