
// src/components/watch2gether/W2GRoomCard.tsx
'use client';

import { WatchTogetherRoom } from "@/types/watch2gether";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Clapperboard, Users } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import ProgressiveImage from "../ProgressiveImage";

interface W2GRoomCardProps {
    room: WatchTogetherRoom;
}

const RoomStatus = ({ room }: { room: WatchTogetherRoom }) => {
    // This logic is a placeholder. You'll need to define what these states mean.
    const isLive = room.playerState.isPlaying;
    const isWaiting = !room.playerState.isPlaying;
    // `isEnded` needs a concrete definition, e.g., based on inactivity.
    const isEnded = false; 

    if(isLive) {
        return <div className="w-full text-center py-2 bg-rose-600 text-white font-bold rounded-md text-sm hover:bg-rose-700 transition-colors">Live</div>
    }
    if(isWaiting) {
        return <div className="w-full text-center py-2 bg-emerald-600 text-white font-bold rounded-md text-sm hover:bg-emerald-700 transition-colors">Waiting...</div>
    }
    return <div className="w-full text-center py-2 bg-muted text-muted-foreground font-bold rounded-md text-sm">Ended</div>
}


export function W2GRoomCard({ room }: W2GRoomCardProps) {

    const timeAgo = room.createdAt ? formatDistanceToNow(room.createdAt.toDate(), { addSuffix: true }) : 'a while ago';
    
    return (
        <Link href={`/watch2gether/${room.id}`} className="group">
            <div className="bg-card border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                <div className="relative aspect-[2/3] w-full">
                    <ProgressiveImage
                        src={room.animePoster}
                        alt={room.animeName || "Anime Poster"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-3">
                    <h3 className="font-semibold truncate text-sm group-hover:text-primary transition-colors">{room.animeName || 'Unknown Anime'}</h3>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                       <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3" /> Ep {room.episodeNumber}</span>
                       <span className="flex items-center gap-1"><Users className="w-3 h-3"/> 1</span>
                    </div>

                    <div className="mt-3">
                        <RoomStatus room={room} />
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=${room.hostId}`} />
                            <AvatarFallback>{room.hostId.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                             <p className="text-xs font-medium text-muted-foreground truncate">{room.name.split("'s")[0] || 'Host'}</p>
                             <p className="text-xs text-muted-foreground/70">{timeAgo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
