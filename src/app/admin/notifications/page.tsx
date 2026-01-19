'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCollection, useFirestore, addDocumentNonBlocking, deleteDocumentNonBlocking, useDoc, setDocumentNonBlocking } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { Bell, Loader2, Send, Trash2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppNotification } from '@/lib/types/notification';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const NotificationComposer = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [isSending, setIsSending] = useState(false);
    const firestore = useFirestore();

    const handleSend = () => {
        if (!title.trim() || !message.trim()) {
            toast.error("Title and message are required.");
            return;
        }

        setIsSending(true);
        const toastId = toast.loading("Queuing notification for delivery...");

        const notificationData: Omit<AppNotification, 'id'> = {
            title,
            message,
            link: link || undefined,
            icon: '📣',
            createdAt: serverTimestamp(),
        };

        const notificationsCol = collection(firestore, 'notifications');
        addDocumentNonBlocking(notificationsCol, notificationData)
            .then(() => {
                toast.success("Notification sent successfully!", { id: toastId });
                setTitle('');
                setMessage('');
                setLink('');
            })
            .catch((err) => {
                console.error("Error sending notification:", err);
                toast.error("Failed to send notification.", { id: toastId });
            })
            .finally(() => {
                setIsSending(false);
            });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compose Push Notification</CardTitle>
                <CardDescription>Create and send a push notification to all users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="notif-title">Title</Label>
                    <Input id="notif-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g., New Episode Available!" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notif-message">Message</Label>
                    <Textarea id="notif-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="E.g., Episode 12 of Jujutsu Kaisen is now live." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="notif-link">Link (Optional)</Label>
                    <Input id="notif-link" value={link} onChange={e => setLink(e.target.value)} placeholder="/watch/jujutsu-kaisen-tv?ep=12" />
                    <p className="text-xs text-muted-foreground">App-internal link, e.g., /anime/some-id</p>
                </div>
            </CardContent>
            <CardFooter className="justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Targeting all users</span>
                </div>
                <Button onClick={handleSend} disabled={isSending}>
                    {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Notification
                </Button>
            </CardFooter>
        </Card>
    );
};

const NotificationHistory = () => {
    const { data: notifications, loading, error } = useCollection<AppNotification>('notifications');
    const firestore = useFirestore();

    const sortedNotifications = notifications?.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this notification? This will remove it for all users.")) return;
        const toastId = toast.loading("Deleting notification...");
        deleteDocumentNonBlocking(doc(firestore, 'notifications', id));
        toast.success("Notification deleted.", { id: toastId });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Push Notification History</CardTitle>
                <CardDescription>A log of previously sent push notifications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : error ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-destructive">{error.message}</TableCell></TableRow>
                        ) : sortedNotifications && sortedNotifications.length > 0 ? (
                            sortedNotifications.map(notif => (
                                <TableRow key={notif.id}>
                                    <TableCell className="font-semibold">{notif.title}</TableCell>
                                    <TableCell className="text-muted-foreground line-clamp-1">{notif.message}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'Sending...'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(notif.id)}>
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No push notifications have been sent yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const AnnouncementSettingsCard = () => {
    const firestore = useFirestore();
    const { data: announcement, loading } = useDoc<any>('site_config/announcement');

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
        const settingsRef = doc(firestore, 'site_config/announcement');

        setDocumentNonBlocking(settingsRef, { text, enabled, type }, { merge: true });

        toast.success("Announcement saved!", { id: toastId });
        setIsSaving(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Announcement</CardTitle>
                <CardDescription>Display a site-wide banner for all users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin"/></div> : <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                        <Label htmlFor="announcement-enabled" className="font-semibold">Enable Announcement Banner</Label>
                        <Switch id="announcement-enabled" checked={enabled} onCheckedChange={setEnabled} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="announcement-text">Banner Text</Label>
                        <Textarea 
                            id="announcement-text" 
                            placeholder="E.g., The site will be down for maintenance at 2 AM EST." 
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
                </>}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || loading} className="ml-auto">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Announcement
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function AdminNotificationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Bell className="w-8 h-8"/> Notifications</h1>
                <p className="text-muted-foreground">Send global push notifications and manage site-wide announcements.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <NotificationComposer />
                    <NotificationHistory />
                </div>
                <div className="space-y-8">
                    <AnnouncementSettingsCard />
                </div>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Important Note</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The "Push Notification" composer creates a notification document in the database. A backend service (like a Cloud Function) is required to listen for these and send actual push notifications via FCM. The "System Announcement" is a live banner shown to all users on the site.</p>
                </CardContent>
            </Card>
        </div>
    );
}