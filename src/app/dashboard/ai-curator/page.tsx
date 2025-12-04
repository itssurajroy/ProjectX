'use client';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiCuratorPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="p-4 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">AI Curator</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                Tired of searching? Let our advanced AI analyze your watch history and preferences to build the perfect, personalized anime playlist for any mood or occasion.
            </p>
            <Button disabled className="mt-8">Coming Soon</Button>
        </div>
    )
}
