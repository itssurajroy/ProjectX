
'use client';

import { WatchTogetherRoom } from "@/lib/types/watch2gether";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Clapperboard, Users } from "lucide-react";
import ProgressiveImage from "../ProgressiveImage";
import { formatDistanceToNow } from "date-fns";

interface W2GRoomCardProps {
    room: WatchTogetherRoom;
}

const RoomStatus = ({ room }: { room: WatchTogetherRoom }) => {
    const isLive = room.playerState.isPlaying;
    
    if(isLive) {
        return <div className="w-full text-center py-2 bg-rose-600 text-white font-bold rounded-md text-sm hover:bg-rose-700 transition-colors">Live</div>
    }

    return <div className="w-full text-center py-2 bg-emerald-600 text-white font-bold rounded-md text-sm hover:bg-emerald-700 transition-colors">Waiting...</div>
}


export function W2GRoomCard({ room }: W2GRoomCardProps) {
    const host = Object.values(room.userProfiles).find(u => u.isHost);

    return (
        <Link href={`/watch2gether/${room.id}`} className="group">
            <div className="bg-card border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                <div className="relative aspect-[2/3] w-full">
                    <ProgressiveImage
                        src={room.animePoster || ''}
                        alt={room.animeName || "Anime Poster"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-3">
                    <h3 className="font-semibold truncate text-sm group-hover:text-primary transition-colors">{room.animeName || 'Unknown Anime'}</h3>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                       <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3" /> Ep {room.episodeNumber}</span>
                       <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {room.users.length}</span>
                    </div>

                    <div className="mt-3">
                        <RoomStatus room={room} />
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={host?.avatar} />
                            <AvatarFallback>{host?.name?.charAt(0) || 'H'}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                             <p className="text-xs font-medium text-muted-foreground truncate">{host?.name || 'Host'}</p>
                             {room.createdAt && (
                                <p className="text-xs text-muted-foreground/70">{formatDistanceToNow(room.createdAt.toDate(), { addSuffix: true })}</p>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
