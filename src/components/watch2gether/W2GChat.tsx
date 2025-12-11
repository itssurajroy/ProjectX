// src/components/watch2gether/W2GChat.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Send } from 'lucide-react';
import { ChatMessage } from '@/types/watch2gether';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

export default function W2GChat({ roomId }: { roomId: string }) {
    const [message, setMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    
    // This component is now disconnected from Firebase.
    // The logic below is placeholder and would need to be adapted
    // to a new backend service (e.g., WebSockets) if one is implemented.
    const messages: ChatMessage[] = [];
    const isLoading = false;

    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, [messages]);


    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        alert("Chat is temporarily disabled.");
    };

    return (
        <div className="h-full flex flex-col bg-card/30">
             <div className="p-4 border-b border-border/50">
                <h2 className="font-bold text-lg">Chat Room</h2>
                <p className="text-xs text-muted-foreground">Chat with your friends</p>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages?.map((msg, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>{msg.userName?.charAt(0) || 'A'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{msg.userName}</p>
                                <div className="text-sm bg-muted/50 p-2 rounded-lg max-w-full break-words">
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                 {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                 {!isLoading && messages?.length === 0 && (
                    <div className="flex justify-center items-center h-full text-sm text-muted-foreground">
                        Chat is currently offline.
                    </div>
                 )}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 flex gap-2">
                <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={"Chat is disabled"}
                    autoComplete="off"
                    disabled
                    className="bg-background/50"
                />
                <Button type="submit" size="icon" disabled>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
