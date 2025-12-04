
'use client';
import { useUser, useFirestore } from '@/firebase';
import { User, Loader2, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, profile, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || '');
        }
        if (user) {
            setPhotoURL(user.photoURL || '');
        }
    }, [profile, user]);

    const handleSaveChanges = async () => {
        if (!user || !firestore) {
            toast.error("You must be logged in to save changes.");
            return;
        }

        setIsSaving(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        
        try {
            await updateDoc(userDocRef, {
                displayName: displayName,
                // photoURL is on the auth object, not profile document typically
                // but for this app structure, we might want it on both
            });
            // You might need a cloud function to update the auth user's photoURL
            // Or handle it on the client if you have the permissions
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
         return (
            <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                <p className="text-muted-foreground">Please log in to view your profile.</p>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <User className="w-8 h-8 text-primary" />
                Profile
            </h1>
            
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View and edit your public profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24 border-4 border-primary/50">
                            <AvatarImage src={photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} />
                            <AvatarFallback>{displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                             <h2 className="text-2xl font-bold">{displayName}</h2>
                             <p className="text-muted-foreground">{user.email}</p>
                             {profile?.role && <p className="text-sm text-primary font-semibold capitalize mt-1">{profile.role}</p>}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input 
                                type="text" 
                                id="displayName" 
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your display name" 
                            />
                        </div>
                         <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="photoURL">Photo URL</Label>
                            <Input 
                                type="url" 
                                id="photoURL" 
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                placeholder="https://example.com/avatar.png"
                            />
                             <p className="text-xs text-muted-foreground">Note: Changing this won't update your Google/other social login avatar.</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
