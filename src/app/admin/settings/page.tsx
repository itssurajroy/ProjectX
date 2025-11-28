
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const featureToggles = [
    { id: 'auto-next', label: 'Auto-Next Episode' },
    { id: 'auto-skip-intro', label: 'Auto-Skip Intro/Outro' },
    { id: 'theater-mode', label: 'Default to Theater Mode' },
    { id: 'continue-watching', label: 'Enable Continue Watching Sync' }
]

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>Manage global site configuration and SEO.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input defaultValue="ProjectX" />
                    </div>
                    <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <Textarea defaultValue="ProjectX - A modern streaming platform for all your favorite shows." />
                    </div>
                    <div className="space-y-2">
                        <Label>Favicon URL</Label>
                        <Input placeholder="/favicon.ico" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Feature Toggles</CardTitle>
                    <CardDescription>Enable or disable features for all users.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {featureToggles.map(feature => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Switch id={feature.id} defaultChecked />
                            <Label htmlFor={feature.id}>{feature.label}</Label>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Player & Ads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Default Player Server Priority</Label>
                        <Input defaultValue="megacloud, vidplay, hls-1" />
                        <p className="text-xs text-muted-foreground">Comma-separated list of server names.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="enable-ads" />
                        <Label htmlFor="enable-ads">Enable Ad Placeholder Slots</Label>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button>Save All Settings</Button>
            </div>
        </div>
    )
}
