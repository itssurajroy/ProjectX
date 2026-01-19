
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, ShieldCheck, Loader2, Info, DollarSign } from "lucide-react";
import { useCollection, useDoc, useFirestore, setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";


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

interface MaintenanceSettings {
    enabled: boolean;
    message: string;
}

const MaintenanceModeCard = () => {
    const firestore = useFirestore();
    const { data: maintenanceSettings, loading } = useDoc<MaintenanceSettings>('settings/maintenance');
    
    const [enabled, setEnabled] = useState(false);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (maintenanceSettings) {
            setEnabled(maintenanceSettings.enabled);
            setMessage(maintenanceSettings.message || '');
        }
    }, [maintenanceSettings]);

    const handleSaveMessage = () => {
        if (isSaving) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving maintenance message...");
        const settingsRef = doc(firestore, 'settings/maintenance');
        
        setDocumentNonBlocking(settingsRef, { message }, { merge: true });
        
        toast.success("Message saved!", { id: toastId });
        setIsSaving(false);
    };

    const handleToggle = (newEnabledState: boolean) => {
        setEnabled(newEnabledState);
        const settingsRef = doc(firestore, 'settings/maintenance');
         setDocumentNonBlocking(settingsRef, {
            enabled: newEnabledState,
        }, { merge: true });
        toast.success(`Maintenance mode has been ${newEnabledState ? 'enabled' : 'disabled'}.`);
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Maintenance Mode</CardTitle>
                    <CardDescription>Block site access for maintenance work.</CardDescription>
                </CardHeader>
                <CardContent className="h-40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        )
    }

    return (
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
                    <Switch id="maintenance-mode" checked={enabled} onCheckedChange={handleToggle} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="maintenance-message">Maintenance Message</Label>
                    <Textarea 
                        id="maintenance-message" 
                        placeholder="E.g., We'll be back shortly! Upgrading our servers." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </CardContent>
             <CardFooter>
                 <Button onClick={handleSaveMessage} disabled={isSaving} className="ml-auto">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Message
                </Button>
            </CardFooter>
        </Card>
    )
}

interface AnnouncementSettings {
    enabled: boolean;
    text: string;
    type: 'info' | 'warning' | 'critical';
}

const AnnouncementSettingsCard = () => {
    const firestore = useFirestore();
    const { data: announcement, loading } = useDoc<AnnouncementSettings>('settings/announcement');

    const [enabled, setEnabled] = useState(false);
    const [text, setText] = useState('');
    const [type, setType] = useState<'info' | 'warning' | 'critical'>('info');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (announcement) {
            setEnabled(announcement.enabled ?? false);
            setText(announcement.text ?? '');
            setType(announcement.type ?? 'info');
        }
    }, [announcement]);

    const handleSave = () => {
        if (isSaving) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving announcement...");
        const settingsRef = doc(firestore, 'settings/announcement');

        setDocumentNonBlocking(settingsRef, { text, enabled, type }, { merge: true });

        toast.success("Announcement saved!", { id: toastId });
        setIsSaving(false);
    };

    const handleToggle = (newEnabledState: boolean) => {
        setEnabled(newEnabledState);
        const settingsRef = doc(firestore, 'settings/announcement');
        setDocumentNonBlocking(settingsRef, { enabled: newEnabledState }, { merge: true });
        toast.success(`Announcement has been ${newEnabledState ? 'enabled' : 'disabled'}.`);
    };

    if (loading) {
         return (
            <Card>
                <CardHeader>
                    <CardTitle>Site-wide Announcement</CardTitle>
                    <CardDescription>Display a banner at the top of the site.</CardDescription>
                </CardHeader>
                <CardContent className="h-40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Site-wide Announcement</CardTitle>
                <CardDescription>Display a banner at the top of the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-blue-500" />
                        <div className="flex flex-col">
                            <Label htmlFor="announcement-enabled" className="font-semibold text-blue-300">Enable Announcement</Label>
                            <span className="text-xs text-blue-400/80">Show banner to all users.</span>
                        </div>
                    </div>
                    <Switch id="announcement-enabled" checked={enabled} onCheckedChange={handleToggle} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="announcement-text">Banner Text</Label>
                    <Textarea 
                        id="announcement-text" 
                        placeholder="E.g., New Jujutsu Kaisen episode is now live!" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="announcement-type">Banner Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as any)}>
                        <SelectTrigger id="announcement-type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="info">Info (Blue)</SelectItem>
                            <SelectItem value="warning">Warning (Amber)</SelectItem>
                            <SelectItem value="critical">Critical (Red)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Announcement
                </Button>
            </CardFooter>
        </Card>
    );
};

interface MonetizationSettings {
    enabled: boolean;
    premiumNoAds: boolean;
    adsFrequency: number;
}

const MonetizationSettingsCard = () => {
    const firestore = useFirestore();
    const { data: settings, loading } = useDoc<MonetizationSettings>('settings/monetization');

    const [enabled, setEnabled] = useState(false);
    const [premiumNoAds, setPremiumNoAds] = useState(true);
    const [adsFrequency, setAdsFrequency] = useState(4);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setEnabled(settings.enabled ?? false);
            setPremiumNoAds(settings.premiumNoAds ?? true);
            setAdsFrequency(settings.adsFrequency ?? 4);
        }
    }, [settings]);

    const handleSave = () => {
        if (isSaving) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving monetization settings...");
        const settingsRef = doc(firestore, 'settings/monetization');

        setDocumentNonBlocking(settingsRef, { adsFrequency }, { merge: true });

        toast.success("Settings saved!", { id: toastId });
        setIsSaving(false);
    };

    const handleToggle = (key: 'enabled' | 'premiumNoAds', value: boolean) => {
        const settingsRef = doc(firestore, 'settings/monetization');
        updateDocumentNonBlocking(settingsRef, { [key]: value });
        toast.success(`Setting updated.`);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-500" />Monetization</CardTitle>
                    <CardDescription>Control ad placements and premium features.</CardDescription>
                </CardHeader>
                <CardContent className="h-40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Monetization
                </CardTitle>
                <CardDescription>Control ad placements and premium features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Label htmlFor="ads-enabled" className="font-semibold text-green-300">Enable Ads Globally</Label>
                    <Switch
                        id="ads-enabled"
                        checked={enabled}
                        onCheckedChange={(val) => {
                            setEnabled(val);
                            handleToggle('enabled', val);
                        }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Label htmlFor="premium-no-ads" className="font-semibold">Premium Disables Ads</Label>
                        <span className="text-xs text-muted-foreground">Exempt premium users from seeing ads.</span>
                    </div>
                    <Switch
                        id="premium-no-ads"
                        checked={premiumNoAds}
                        onCheckedChange={(val) => {
                            setPremiumNoAds(val);
                            handleToggle('premiumNoAds', val);
                        }}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="ads-frequency">Ad Frequency</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="ads-frequency"
                            type="number"
                            value={adsFrequency}
                            onChange={(e) => setAdsFrequency(Number(e.target.value))}
                            className="max-w-[100px]"
                        />
                        <span className="text-sm text-muted-foreground">ads per hour</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Frequency
                </Button>
            </CardFooter>
        </Card>
    );
};


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

                    <MonetizationSettingsCard />

                </div>

                <div className="space-y-8">
                    <MaintenanceModeCard />
                    <AnnouncementSettingsCard />
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

