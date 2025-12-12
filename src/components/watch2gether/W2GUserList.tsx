
// src/components/watch2gether/W2GUserList.tsx
'use client';
import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RoomUser } from "@/lib/types/watch2gether";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


export default function W2GUserList({ users, hostId }: { users: RoomUser[], hostId: string }) {
    return (
        <div className="mt-4 space-y-2">
            {users.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium flex-1 truncate">{user.name}</span>
                    {user.id === hostId && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Crown className="w-4 h-4 text-amber-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Room Host</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            ))}
        </div>
    )
}
