
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plug, KeyRound, Save, Loader2, Webhook, BarChart, Server, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore, setDocumentNonBlocking, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


// --- INTERFACES ---
interface ApiKeySettings {
    malClientId?: string;
    anilistId?: string;
    anilistSecret?: string;
}

interface WebhookItem {
    id: string;
    name: string;
    url: string;
    events: string[];
}

interface RateLimitSettings {
    enabled: boolean;
    requestsPerMinute: number;
}

interface CdnSettings {
    provider: 'gcore' | 'bunny' | 'other' | 'none';
    pullZoneUrl: string;
}

const WEBHOOK_EVENTS = [
    { id: 'new_episode', label: 'New Episode Published' },
    { id: 'new_user', label: 'New User Registration' },
    { id: 'new_comment', label: 'New Comment Posted' },
    { id: 'new_report', label: 'New Content Report' },
];


// --- COMPONENTS ---

const MalKeyManager = () => {
    const firestore = useFirestore();
    const { data: settings, loading } = useDoc<ApiKeySettings>('settings/api_keys');
    const [key, setKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings && settings.malClientId) {
            setKey(settings.malClientId);
        }
    }, [settings]);
    
    const handleSave = () => {
        setIsSaving(true);
        const toastId = toast.loading(`Saving MyAnimeList key...`);
        const settingsRef = doc(firestore, 'settings', 'api_keys');
        
        setDocumentNonBlocking(settingsRef, { malClientId: key }, { merge: true });

        toast.success(`MyAnimeList key saved!`, { id: toastId });
        setIsSaving(false);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" /> MyAnimeList Integration
                </CardTitle>
                <CardDescription>Client ID for fetching supplementary anime data from MAL.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <div className="space-y-2">
                        <Label htmlFor="mal-client-id">MyAnimeList Client ID</Label>
                        <Input
                            id="mal-client-id"
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter your MAL Client ID..."
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
};

const AniListKeyManager = () => {
    const firestore = useFirestore();
    const { data: settings, loading } = useDoc<ApiKeySettings>('settings/api_keys');
    const [id, setId] = useState('');
    const [secret, setSecret] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setId(settings.anilistId || '');
            setSecret(settings.anilistSecret || '');
        }
    }, [settings]);
    
    const handleSave = () => {
        setIsSaving(true);
        const toastId = toast.loading(`Saving AniList keys...`);
        const settingsRef = doc(firestore, 'settings', 'api_keys');
        
        setDocumentNonBlocking(settingsRef, { anilistId: id, anilistSecret: secret }, { merge: true });

        toast.success(`AniList keys saved!`, { id: toastId });
        setIsSaving(false);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-primary" /> AniList Integration</CardTitle>
                <CardDescription>Client ID and Secret for AniList API access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="anilist-id">AniList Client ID</Label>
                            <Input id="anilist-id" type="password" value={id} onChange={e => setId(e.target.value)} placeholder="Enter AniList Client ID..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="anilist-secret">AniList Client Secret</Label>
                            <Input id="anilist-secret" type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="Enter AniList Client Secret..." />
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving || loading} className="ml-auto">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save AniList Keys
                </Button>
            </CardFooter>
        </Card>
    );
}

const WebhookDialog = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (webhook: Omit<WebhookItem, 'id'>) => void }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [events, setEvents] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = () => {
        if (!name.trim() || !url.trim()) {
            toast.error("Name and URL are required.");
            return;
        }
        try {
            new URL(url);
        } catch (_) {
            toast.error("Please enter a valid URL.");
            return;
        }
        
        setIsSaving(true);
        onAdd({ name, url, events });
        setIsSaving(false);
        onClose();
        setName('');
        setUrl('');
        setEvents([]);
    }

    const toggleEvent = (eventId: string) => {
        setEvents(prev => prev.includes(eventId) ? prev.filter(e => e !== eventId) : [...prev, eventId]);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Webhook</DialogTitle>
                    <DialogDescription>Send event notifications to an external URL.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-name">Webhook Name</Label>
                        <Input id="webhook-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Discord Notifications" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="webhook-url">Endpoint URL</Label>
                        <Input id="webhook-url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
                    </div>
                     <div className="space-y-2">
                        <Label>Events to Trigger</Label>
                        <div className="space-y-2 rounded-md border p-4">
                            {WEBHOOK_EVENTS.map(event => (
                                <div key={event.id} className="flex items-center space-x-2">
                                    <Checkbox id={`event-${event.id}`} checked={events.includes(event.id)} onCheckedChange={() => toggleEvent(event.id)} />
                                    <Label htmlFor={`event-${event.id}`}>{event.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>} Add Webhook
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const WebhooksManager = () => {
    const { data: webhooks, loading } = useCollection<WebhookItem>('settings_webhooks');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const firestore = useFirestore();

    const handleAdd = (webhook: Omit<WebhookItem, 'id'>) => {
        const toastId = toast.loading("Adding webhook...");
        const webhooksCol = collection(firestore, 'settings_webhooks');
        addDocumentNonBlocking(webhooksCol, webhook);
        toast.success("Webhook added!", { id: toastId });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this webhook?")) return;
        const toastId = toast.loading("Deleting webhook...");
        const webhookRef = doc(firestore, 'settings_webhooks', id);
        deleteDocumentNonBlocking(webhookRef);
        toast.success("Webhook deleted.", { id: toastId });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><Webhook className="w-5 h-5 text-primary" /> Webhooks</CardTitle>
                        <Button size="sm" onClick={() => setIsAddOpen(true)}><PlusCircle className="w-4 h-4 mr-2" /> Add</Button>
                    </div>
                    <CardDescription>Configure outgoing webhooks for external service notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={3} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                            ) : webhooks && webhooks.length > 0 ? (
                                webhooks.map(hook => (
                                    <TableRow key={hook.id}>
                                        <TableCell className="font-semibold">{hook.name}</TableCell>
                                        <TableCell>{hook.events.length}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDelete(hook.id)}><Trash2 className="w-4 h-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={3} className="text-center p-8 text-muted-foreground">No webhooks configured.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <WebhookDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
        </>
    );
};


const RateLimitingManager = () => {
    const firestore = useFirestore();
    const { data: settings, loading } = useDoc<RateLimitSettings>('settings/api_rate_limiting');

    const [enabled, setEnabled] = useState(false);
    const [requests, setRequests] = useState(120);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setEnabled(settings.enabled);
            setRequests(settings.requestsPerMinute);
        }
    }, [settings]);

    const handleSave = () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving rate limit settings...");
        const settingsRef = doc(firestore, 'settings', 'api_rate_limiting');
        setDocumentNonBlocking(settingsRef, { enabled, requestsPerMinute: requests }, { merge: true });
        toast.success("Settings saved!", { id: toastId });
        setIsSaving(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-primary" /> API Rate Limiting</CardTitle>
                <CardDescription>Set rate limits for your public API proxy to prevent abuse.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="rate-limit-switch" className="font-semibold">Enable Rate Limiting</Label>
                            <Switch id="rate-limit-switch" checked={enabled} onCheckedChange={setEnabled} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="rate-limit-requests">Requests per minute</Label>
                            <Input id="rate-limit-requests" type="number" value={requests} onChange={e => setRequests(Number(e.target.value))}/>
                        </div>
                    </>
                )}
            </CardContent>
             <CardFooter>
                <Button onClick={handleSave} disabled={isSaving || loading} className="ml-auto">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Settings
                </Button>
            </CardFooter>
        </Card>
    );
};

const CdnManager = () => {
    const firestore = useFirestore();
    const { data: settings, loading } = useDoc<CdnSettings>('settings/cdn_settings');

    const [provider, setProvider] = useState<'gcore' | 'bunny' | 'other' | 'none'>('none');
    const [pullZoneUrl, setPullZoneUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setProvider(settings.provider || 'none');
            setPullZoneUrl(settings.pullZoneUrl || '');
        }
    }, [settings]);

    const handleSave = () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving CDN settings...");
        const settingsRef = doc(firestore, 'settings', 'cdn_settings');
        setDocumentNonBlocking(settingsRef, { provider, pullZoneUrl }, { merge: true });
        toast.success("CDN settings saved!", { id: toastId });
        setIsSaving(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5 text-primary" /> CDN & External Players</CardTitle>
                <CardDescription>Manage CDN settings and external player integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="cdn-provider">CDN Provider</Label>
                             <Select value={provider} onValueChange={(v) => setProvider(v as any)}>
                                <SelectTrigger id="cdn-provider">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="gcore">Gcore</SelectItem>
                                    <SelectItem value="bunny">BunnyCDN</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pull-zone">Pull Zone URL</Label>
                            <Input id="pull-zone" value={pullZoneUrl} onChange={e => setPullZoneUrl(e.target.value)} placeholder="https://cdn.example.com" />
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || loading} className="ml-auto">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save CDN Settings
                </Button>
            </CardFooter>
        </Card>
    );
};


// --- MAIN PAGE ---
export default function AdminApiSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Plug className="w-8 h-8"/> API Integration</h1>
                <p className="text-muted-foreground">Manage API keys, webhooks, and third-party service connections.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <div className="space-y-8">
                    <MalKeyManager />
                    <WebhooksManager />
                    <CdnManager />
                </div>
                 <div className="space-y-8">
                    <AniListKeyManager />
                    <RateLimitingManager />
                 </div>
            </div>
        </div>
    );
}
