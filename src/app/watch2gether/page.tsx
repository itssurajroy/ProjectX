'use client';

import { useState } from "react";
import { Loader2, PlusCircle, Users } from 'lucide-react';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { W2GRoomCard } from "@/components/watch2gether/W2GRoomCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Watch2GetherLobby() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    // Since database is removed, Watch Together is non-functional.
    // Display a message to the user.
    const isLoading = false;
    const error = null;
    const filteredRooms: any[] = [];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="w-8 h-8 text-primary"/> Watch Together</h1>
                    <p className="text-muted-foreground mt-1">Join a public room or create your own party.</p>
                </div>
                <Button disabled>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Room
                </Button>
            </div>
            
            <div className="text-center py-20 border border-dashed border-border rounded-lg">
                <h3 className="text-xl font-semibold">Watch Together is Temporarily Offline</h3>
                <p className="text-muted-foreground mt-2">This feature is currently undergoing maintenance as we upgrade our backend systems.</p>
            </div>
        </div>
    );
}
