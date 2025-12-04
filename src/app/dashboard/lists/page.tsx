'use client';
import { List } from 'lucide-react';

export default function ListsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <List className="w-8 h-8 text-primary" />
                Custom Lists
            </h1>
            <p className="text-muted-foreground mt-2">
                Create and share your own custom anime lists. This feature is coming soon!
            </p>
        </div>
    )
}