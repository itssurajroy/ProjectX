'use client';
import { User } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                Profile
            </h1>
            <p className="text-muted-foreground mt-2">
                Customize your public profile. This feature is coming soon!
            </p>
        </div>
    )
}