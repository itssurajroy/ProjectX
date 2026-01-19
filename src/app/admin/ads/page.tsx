
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, PlusCircle, Trash2, Megaphone, DollarSign, Settings, SlidersHorizontal } from "lucide-react";
import { useDoc, useCollection, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

// --- DATA INTERFACES ---
interface AdSettings {
    adsEnabled: boolean;
    adNetwork: 'adsense' | 'custom';
    adsensePublisherId?: string;
    customAdTagUrl?: string;
    adFrequency: number; // e.g., ads per hour
}

interface AdSlot {
    id: string;
    name: string;
    type: 'banner' | 'video_preroll' | 'video_midroll' | 'sidebar_box';
    size: string; // e.g., "728x90", "300x250"
    enabled: boolean;
}

// --- COMPONENTS ---

// AddAdSlotDialog component
function AddAdSlotDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<'banner' | 'video_preroll' | 'video_midroll' | 'sidebar_box'>('banner');
    const [size, setSize] = useState('728x90');
    const [enabled, setEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const firestore = useFirestore();

    const handleAddSlot = () => {
        if (!name.trim()) {
            toast.error("Slot name is required.");
            return;
        }
        setIsSaving(true);
        const toastId = toast.loading("Adding ad slot...");
        const slotsCol = collection(firestore, 'settings_ad_slots');
        addDocumentNonBlocking(slotsCol, { name, type, size, enabled });
        toast.success("Ad slot added!", { id: toastId });
        setIsSaving(false);
        setOpen(false);
        // Reset form
        setName('');
        setType('banner');
        setSize('728x90');
        setEnabled(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><PlusCircle className="w-4 h-4"/> Add Slot</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Ad Slot</DialogTitle>
                    <DialogDescription>Define a new placement zone for advertisements.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="slot-name">Slot Name</Label>
                        <Input id="slot-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Sidebar Top Banner" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slot-type">Slot Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as any)}>
                            <SelectTrigger id="slot-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="banner">Banner</SelectItem>
                                <SelectItem value="sidebar_box">Sidebar Box</SelectItem>
                                <SelectItem value="video_preroll">Video Pre-roll</SelectItem>
                                <SelectItem value="video_midroll">Video Mid-roll</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slot-size">Ad Size</Label>
                        <Input id="slot-size" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g., 728x90" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="slot-enabled" checked={enabled} onCheckedChange={setEnabled} />
                        <Label htmlFor="slot-enabled">Enabled</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSlot} disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>} Add Slot
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// AdNetworkConfigCard component
const AdNetworkConfigCard = ({ settings, setSettings, isSaving, handleSave, loading }: { settings: AdSettings, setSettings: React.Dispatch<React.SetStateAction<AdSettings>>, isSaving: boolean, handleSave: () => void, loading: boolean }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-400"/> Ad Network</CardTitle>
                <CardDescription>Configure your primary ad provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="ad-network">Ad Network Provider</Label>
                            <Select value={settings.adNetwork} onValueChange={(val) => setSettings(prev => ({...prev, adNetwork: val as any}))}>
                                <SelectTrigger id="ad-network"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="adsense">Google AdSense</SelectItem>
                                    <SelectItem value="custom">Custom Ad Tags</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {settings.adNetwork === 'adsense' && (
                             <div className="space-y-2">
                                <Label htmlFor="adsenseId">AdSense Publisher ID</Label>
                                <Input id="adsenseId" value={settings.adsensePublisherId || ''} onChange={(e) => setSettings(prev => ({ ...prev, adsensePublisherId: e.target.value }))} placeholder="pub-xxxxxxxxxxxxxxxx" />
                            </div>
                        )}
                         {settings.adNetwork === 'custom' && (
                             <div className="space-y-2">
                                <Label htmlFor="customAdTagUrl">Custom Ad Tag URL</Label>
                                <Textarea id="customAdTagUrl" value={settings.customAdTagUrl || ''} onChange={(e) => setSettings(prev => ({ ...prev, customAdTagUrl: e.target.value }))} placeholder="Enter your script or ad tag URL..." />
                            </div>
                        )}
                    </>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || loading} className="w-full">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Network Settings
                </Button>
            </CardFooter>
        </Card>
    );
};


// AdRulesCard component
const AdRulesCard = ({ settings, setSettings, isSaving, handleSave, loading }: { settings: AdSettings, setSettings: React.Dispatch<React.SetStateAction<AdSettings>>, isSaving: boolean, handleSave: () => void, loading: boolean }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-blue-400" /> Ad Rules & Frequency</CardTitle>
                <CardDescription>Set global rules for when and how ads are displayed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="adsEnabled" className="font-semibold">Enable Ads Globally</Label>
                            <Switch id="adsEnabled" checked={settings.adsEnabled} onCheckedChange={(val) => setSettings(prev => ({...prev, adsEnabled: val}))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adFrequency">Ad Frequency</Label>
                            <div className="flex items-center gap-2">
                                <Input id="adFrequency" type="number" value={settings.adFrequency} onChange={e => setSettings(prev => ({...prev, adFrequency: Number(e.target.value)}))} className="max-w-[100px]" />
                                <span className="text-sm text-muted-foreground">ads per hour</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || loading} className="w-full">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Rules
                </Button>
            </CardFooter>
        </Card>
    );
};


// Main component
export default function AdminAdsPage() {
    const firestore = useFirestore();
    const { data: adSettings, loading: loadingSettings } = useDoc<AdSettings>('settings/advertisements');
    const { data: adSlots, loading: loadingSlots } = useCollection<AdSlot>('settings_ad_slots');

    const [settings, setSettings] = useState<AdSettings>({
        adsEnabled: false,
        adNetwork: 'adsense',
        adsensePublisherId: '',
        customAdTagUrl: '',
        adFrequency: 2,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (adSettings) {
            setSettings(s => ({...s, ...adSettings}));
        }
    }, [adSettings]);

    const handleSaveSettings = () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving ad settings...");
        const settingsRef = doc(firestore, 'settings/advertisements');
        setDocumentNonBlocking(settingsRef, settings, { merge: true });
        toast.success("Ad settings saved!", { id: toastId });
        setIsSaving(false);
    };

    const handleDeleteSlot = (id: string) => {
        if (!confirm("Are you sure you want to delete this ad slot? This cannot be undone.")) return;
        const toastId = toast.loading("Deleting slot...");
        const slotRef = doc(firestore, 'settings_ad_slots', id);
        deleteDocumentNonBlocking(slotRef);
        toast.success("Slot deleted.", { id: toastId });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Megaphone className="w-8 h-8"/> Advertisement Management</h1>
                <p className="text-muted-foreground">Manage ad networks, placement zones, and frequency rules.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {/* Ad Slots Management */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-primary" />Ad Placement Zones</CardTitle>
                                <CardDescription>Define where ads can appear on the site.</CardDescription>
                            </div>
                            <AddAdSlotDialog />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingSlots ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
                                    ) : adSlots && adSlots.length > 0 ? (
                                        adSlots.map(slot => (
                                            <TableRow key={slot.id}>
                                                <TableCell className="font-semibold">{slot.name}</TableCell>
                                                <TableCell className="capitalize">{slot.type.replace('_', '-')}</TableCell>
                                                <TableCell className="font-mono text-xs">{slot.size}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slot.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {slot.enabled ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteSlot(slot.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No ad slots defined.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                     <AdNetworkConfigCard settings={settings} setSettings={setSettings} isSaving={isSaving} handleSave={handleSaveSettings} loading={loadingSettings} />
                     <AdRulesCard settings={settings} setSettings={setSettings} isSaving={isSaving} handleSave={handleSaveSettings} loading={loadingSettings} />
                </div>
            </div>
        </div>
    );
}
