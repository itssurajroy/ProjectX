
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Send } from 'lucide-react';
import { ChatMessage } from '@/lib/types/watch2gether';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { useCollection, useUser, db } from '@/firebase/client';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function W2GChat({ roomId }: { roomId: string }) {
    const { user, userProfile } = useUser();
    const [message, setMessage] = useState('');
    const { data: messages, loading: isLoading } = useCollection<ChatMessage>(`watch-together-rooms/${roomId}/chat`);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, [messages]);


    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !userProfile) {
            if(!user) toast.error("You must be logged in to chat.");
            return;
        }

        const chatRef = collection(db, `watch-together-rooms/${roomId}/chat`);
        
        try {
            await addDoc(chatRef, {
                userId: user.uid,
                userName: userProfile.displayName,
                avatar: userProfile.photoURL,
                text: message,
                timestamp: serverTimestamp(),
            });
            setMessage('');
        } catch (error) {
            console.error("Error sending chat message:", error);
            toast.error("Failed to send message.");
        }
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
                        Be the first to say something!
                    </div>
                 )}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 flex gap-2">
                <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={user ? "Send a message..." : "Log in to chat"}
                    autoComplete="off"
                    disabled={!user}
                    className="bg-background/50"
                />
                <Button type="submit" size="icon" disabled={!message.trim() || !user}>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
