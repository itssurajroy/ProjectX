'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground">Configure system-wide settings, feature flags, and integrations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Feature Flags</CardTitle>
                        <CardDescription>Enable or disable features across the site.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Feature flag management will be available here.</p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Site-wide Announcement</CardTitle>
                        <CardDescription>Display a banner at the top of the site for all users.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                             <Label htmlFor="announcement-text">Banner Text</Label>
                            <Textarea id="announcement-text" placeholder="E.g., Site maintenance scheduled for Sunday at 3 AM EST." disabled />
                         </div>
                        <Button disabled>Publish Announcement</Button>
                        <p className="text-xs text-muted-foreground">Feature coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
