'use client';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeStudioPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="p-4 bg-primary/10 rounded-full mb-6">
                 <Palette className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Theme Studio</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                Unleash your creativity. Customize the look and feel of Project X with your own unique color schemes and share them with the community.
            </p>
            <Button disabled className="mt-8">Coming Soon</Button>
        </div>
    )
}
