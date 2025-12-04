'use client';
import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WatchPartiesPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="p-4 bg-primary/10 rounded-full mb-6">
                <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Watch Parties</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                Create or join public and private rooms to watch anime together with friends and the community in real-time.
            </p>
            <Button asChild className="mt-8">
                <Link href="/watch2gether">
                    Go to Lobby
                </Link>
            </Button>
        </div>
    )
}
