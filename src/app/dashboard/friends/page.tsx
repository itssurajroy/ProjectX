
'use client';
import { Users, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PlaceholderFriend = ({ name, watching }: { name: string; watching: string }) => (
    <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
            <div>
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">Watching: {watching}</p>
            </div>
        </div>
        <Button variant="ghost" size="sm">View Profile</Button>
    </div>
);

export default function FriendsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-primary" />
                Friends
            </h1>
            
            <div className="bg-card/50 border border-border/50 rounded-lg p-4 mb-8">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><UserPlus className="w-5 h-5 text-muted-foreground" /> Add a Friend</h3>
                <div className="flex gap-2">
                    <Input placeholder="Enter a friend's username..." className="bg-background/50"/>
                    <Button><Search className="w-4 h-4 mr-2"/>Search</Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-2">This feature is coming soon!</p>
            </div>

            <div className="space-y-3">
                <PlaceholderFriend name="ShadowSlayer_27" watching="Jujutsu Kaisen - S2 E14" />
                <PlaceholderFriend name="AnimeGoddess" watching="Frieren: Beyond Journey's End - E28" />
                <PlaceholderFriend name="IsekaiDreamer" watching="Solo Leveling - E10" />
            </div>

            <div className="text-center py-10 border-t border-border/50 mt-8">
                <p className="text-muted-foreground">The full friends system is under construction.</p>
            </div>
        </div>
    )
}
