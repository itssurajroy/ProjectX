'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, ShieldCheck } from "lucide-react";

const FeatureFlagItem = ({ title, description, enabled = false }: { title: string, description: string, enabled?: boolean }) => (
    <div className="flex items-center justify-between space-x-2 py-3">
        <div className="flex flex-col">
            <Label htmlFor={`flag-${title.toLowerCase().replace(' ', '-')}`} className="font-semibold">{title}</Label>
            <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <Switch id={`flag-${title.toLowerCase().replace(' ', '-')}`} defaultChecked={enabled} disabled />
    </div>
);


export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground">Configure system-wide settings, feature flags, and integrations.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Feature Flags</CardTitle>
                            <CardDescription>Enable or disable features across the site.</CardDescription>
                        </CardHeader>
                        <CardContent className="divide-y divide-border">
                            <FeatureFlagItem title="Watch Together (W2G)" description="Enables real-time synchronized video rooms." enabled={true} />
                            <FeatureFlagItem title="AI Curator" description="Allows users to generate AI-based playlists." enabled={true} />
                            <FeatureFlagItem title="Manga Reader" description="Activates the manga reading section of the site." />
                             <FeatureFlagItem title="User Profiles V2" description="Rolls out the new social profile design." />
                        </CardContent>
                         <CardFooter>
                             <p className="text-xs text-muted-foreground">Rollout percentages and role-based visibility coming soon.</p>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Streaming Controls</CardTitle>
                            <CardDescription>Manage streaming sources and failure thresholds.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground">Global host priority and link health settings will be here.</p>
                         </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monetization</CardTitle>
                            <CardDescription>Control ad placements and premium features.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground">Ad frequency caps and sponsor banner settings will be here.</p>
                         </CardContent>
                    </Card>

                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Mode</CardTitle>
                            <CardDescription>Block site access for maintenance work.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                    <div className="flex flex-col">
                                        <Label htmlFor="maintenance-mode" className="font-semibold text-amber-300">Enable Maintenance Mode</Label>
                                        <span className="text-xs text-amber-400/80">Admins will still have access.</span>
                                    </div>
                                </div>
                                <Switch id="maintenance-mode" disabled />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                                <Textarea id="maintenance-message" placeholder="E.g., We'll be back shortly! Upgrading our servers." disabled />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Site-wide Announcement</CardTitle>
                            <CardDescription>Display a banner at the top of the site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                 <Label htmlFor="announcement-text">Banner Text</Label>
                                <Textarea id="announcement-text" placeholder="E.g., New Jujutsu Kaisen episode is now live!" disabled />
                             </div>
                            <Button disabled>Publish Announcement</Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" /> Security
                            </CardTitle>
                            <CardDescription>Configure rate limiting, CAPTCHA, and API keys.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground">Security settings will be managed here.</p>
                         </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
