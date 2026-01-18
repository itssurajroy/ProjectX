'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useCollection, useFirestore, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import toast from "react-hot-toast";

interface FeatureFlag {
    id: string;
    description: string;
    enabled: boolean;
}

const FeatureFlagItem = ({ flag }: { flag: FeatureFlag }) => {
    const firestore = useFirestore();

    const handleToggle = (enabled: boolean) => {
        const flagRef = doc(firestore, 'settings_feature_flags', flag.id);
        updateDocumentNonBlocking(flagRef, { enabled });
        toast.success(`'${flag.id.replace(/([A-Z])/g, ' $1')}' has been ${enabled ? 'enabled' : 'disabled'}.`);
    }

    return (
        <div className="flex items-center justify-between space-x-2 py-3">
            <div className="flex flex-col">
                <Label htmlFor={`flag-${flag.id}`} className="font-semibold capitalize">{flag.id.replace(/([A-Z])/g, ' $1')}</Label>
                <span className="text-xs text-muted-foreground">{flag.description}</span>
            </div>
            <Switch
                id={`flag-${flag.id}`}
                checked={flag.enabled}
                onCheckedChange={handleToggle}
            />
        </div>
    );
};

const FeatureFlagsCard = () => {
    const { data: featureFlags, loading } = useCollection<FeatureFlag>('settings_feature_flags');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Enable or disable features across the site.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
                {loading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : featureFlags && featureFlags.length > 0 ? (
                    featureFlags.map(flag => <FeatureFlagItem key={flag.id} flag={flag} />)
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No feature flags found in database.</p>
                )}
            </CardContent>
             <CardFooter>
                 <p className="text-xs text-muted-foreground">Changes are applied in real-time.</p>
            </CardFooter>
        </Card>
    );
}


export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground">Configure system-wide settings, feature flags, and integrations.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                <div className="space-y-8">
                     <FeatureFlagsCard />

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
