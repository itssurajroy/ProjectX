'use client';
import { Users } from 'lucide-react';

export default function FriendsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Friends
            </h1>
            <p className="text-muted-foreground mt-2">
                Connect with friends and see what they're watching. This feature is coming soon!
            </p>
        </div>
    )
}