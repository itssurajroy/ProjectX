

'use client';
import { User, Loader2, Save, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '@/firebase/auth/use-user';
import { db } from '@/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RoleBadge = ({ role }: { role: 'user' | 'moderator' | 'admin' }) => {
    const roleStyles = {
        user: 'bg-transparent text-muted-foreground border-border',
        moderator: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        admin: 'bg-primary/10 text-primary border-primary/20',
    };
    return (
        <Badge className={cn('capitalize', roleStyles[role])}>
            {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
            {role}
        </Badge>
    );
};


export default function ProfilePage() {
    const { user, userProfile, loading } = useUser();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setDisplayName(userProfile.displayName || '');
            setPhotoURL(userProfile.photoURL || '');
        }
    }, [userProfile]);
    
    const handleSaveChanges = async () => {
        if (!user) {
            toast.error("You must be logged in to save changes.");
            return;
        }
        setIsSaving(true);
        const toastId = toast.loading("Saving profile...");
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName,
                photoURL
            });
            await updateProfile(user, {
                displayName,
                photoURL
            })
            toast.success("Profile updated successfully!", { id: toastId });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    if (!user || !userProfile) {
        return (
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                    <User className="w-8 h-8 text-primary" />
                    Profile
                </h1>
                <div className="text-center py-20 bg-card/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-muted-foreground">Log in to view your profile.</p>
                </div>
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
                            <AvatarFallback>{displayName?.charAt(0) || userProfile.email.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                             <h2 className="text-2xl font-bold">{displayName}</h2>
                             <p className="text-muted-foreground">{userProfile.email}</p>
                             <div className="mt-2">
                                <RoleBadge role={userProfile.role} />
                            </div>
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
                             <p className="text-xs text-muted-foreground">Note: Changing this won't update your social login avatar.</p>
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
