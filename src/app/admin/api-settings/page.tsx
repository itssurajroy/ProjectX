
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plug, KeyRound, Save, Loader2, Webhook, BarChart, Server } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";

interface ApiKeySettings {
    malClientId?: string;
    anilistId?: string;
    anilistSecret?: string;
}

const ApiKeyManager = ({ serviceName, serviceKey, description, placeholder }: { serviceName: string, serviceKey: keyof ApiKeySettings, description: string, placeholder: string }) => {
    const firestore = useFirestore();
    const { data: settings, loading } = useDoc<ApiKeySettings>('settings/api_keys');
    const [key, setKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings && settings[serviceKey]) {
            setKey(settings[serviceKey]!);
        }
    }, [settings, serviceKey]);
    
    const handleSave = () => {
        setIsSaving(true);
        const toastId = toast.loading(`Saving ${serviceName} key...`);
        const settingsRef = doc(firestore, 'settings', 'api_keys');
        
        setDocumentNonBlocking(settingsRef, { [serviceKey]: key }, { merge: true });

        toast.success(`${serviceName} key saved!`, { id: toastId });
        setIsSaving(false);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" /> {serviceName} Integration
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <div className="space-y-2">
                        <Label htmlFor={`${serviceKey}-input`}>{serviceName} Client ID</Label>
                        <Input
                            id={`${serviceKey}-input`}
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving || loading} className="ml-auto">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Key
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function AdminApiSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Plug className="w-8 h-8"/> API Integration</h1>
                <p className="text-muted-foreground">Manage API keys, webhooks, and third-party service connections.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <div className="space-y-8">
                    <ApiKeyManager 
                        serviceName="MyAnimeList"
                        serviceKey="malClientId"
                        description="Client ID for fetching supplementary anime data from MAL."
                        placeholder="Enter your MAL Client ID..."
                    />
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Webhook className="w-5 h-5 text-primary" /> Webhooks</CardTitle>
                            <CardDescription>Configure outgoing webhooks for external service notifications (e.g., Discord).</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground text-sm">Webhook configuration is coming soon.</p>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-primary"/> API Rate Limiting</CardTitle>
                            <CardDescription>Set rate limits for your public API proxy to prevent abuse.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="rate-limit-switch">Enable Rate Limiting</Label>
                                <Switch id="rate-limit-switch" disabled />
                            </div>
                             <div className="space-y-2">
                                <Label>Requests per minute</Label>
                                <Input type="number" defaultValue="120" disabled/>
                            </div>
                        </CardContent>
                         <CardFooter>
                            <p className="text-xs text-muted-foreground">This feature is under development.</p>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5 text-primary" /> CDN & External Players</CardTitle>
                            <CardDescription>Manage CDN settings and external player integrations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">CDN configuration is planned for a future update.</p>
                        </CardContent>
                    </Card>
                 </div>

            </div>
        </div>
    );
}
