
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCollection, useFirestore, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { Bell, Loader2, Send, Trash2, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AppNotification } from '@/lib/types/notification';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

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
                <CardTitle>Compose Notification</CardTitle>
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
                <CardTitle>Sent History</CardTitle>
                <CardDescription>A log of previously sent notifications.</CardDescription>
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
                             <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No notifications have been sent yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export default function AdminNotificationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Bell className="w-8 h-8"/> Notifications</h1>
                <p className="text-muted-foreground">Send global push notifications to all users.</p>
            </div>
            
            <NotificationComposer />
            <NotificationHistory />

             <Card>
                <CardHeader>
                    <CardTitle>Important Note</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This interface creates a notification document in the database. A backend service (like a Cloud Function) is required to listen for these documents and send actual push notifications via Firebase Cloud Messaging (FCM). However, this app includes a client-side listener that will show a "toast" notification in real-time for any user currently on the site.</p>
                </CardContent>
            </Card>
        </div>
    );
}
