
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function AnnouncementsPage() {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create Global Banner</CardTitle>
                    <CardDescription>This banner will appear at the top of the site for all users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="banner-text">Banner Text</Label>
                        <Input id="banner-text" placeholder="e.g., Site maintenance tonight at 2 AM EST." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <Select defaultValue="blue">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="yellow">Yellow</SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end pb-2">
                            <div className="flex items-center space-x-2">
                                <Switch id="banner-dismissible" />
                                <Label htmlFor="banner-dismissible">Dismissible</Label>
                            </div>
                        </div>
                    </div>
                    <Button>Publish Banner</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Send Push Notification</CardTitle>
                    <CardDescription>This will send a Firebase Cloud Message to all subscribed users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="notification-title">Title</Label>
                        <Input id="notification-title" placeholder="e.g., New Episode Alert!" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notification-body">Body</Label>
                        <Textarea id="notification-body" placeholder="e.g., Episode 1090 of One Piece is now live!" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notification-link">Link (Optional)</Label>
                        <Input id="notification-link" placeholder="/watch/one-piece-100?ep=1090" />
                    </div>
                    <Button>Send Notification</Button>
                </CardContent>
            </Card>
        </div>
    )
}
