'use client';
import { User, Loader2, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const [displayName, setDisplayName] = useState('Guest');
    const [photoURL, setPhotoURL] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Since the database connection is removed, this page is a display-only placeholder.

    const handleSaveChanges = async () => {
        setIsSaving(true);
        toast.error("Profile updates are temporarily disabled.");
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
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
                     <div className="text-center py-10 bg-card/50 rounded-lg border border-dashed border-border/50">
                        <p className="text-muted-foreground">Log in to view your profile.</p>
                        <p className="text-xs text-muted-foreground mt-1">This feature is temporarily disabled.</p>
                    </div>

                    <div className="flex items-center gap-6 opacity-30 pointer-events-none">
                        <Avatar className="w-24 h-24 border-4 border-primary/50">
                            <AvatarImage src={photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=guest`} />
                            <AvatarFallback>{displayName?.charAt(0) || 'G'}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                             <h2 className="text-2xl font-bold">{displayName}</h2>
                             <p className="text-muted-foreground">guest@projectx.com</p>
                             <p className="text-sm text-primary font-semibold capitalize mt-1">user</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 opacity-30 pointer-events-none">
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
                        <Button onClick={handleSaveChanges} disabled={true}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
