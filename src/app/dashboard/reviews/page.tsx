'use client';
import { MessageCircle } from 'lucide-react';

export default function ReviewsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-primary" />
                Your Reviews
            </h1>
            <p className="text-muted-foreground mt-2">
                Manage all the reviews you've written. This feature is coming soon!
            </p>
        </div>
    )
}