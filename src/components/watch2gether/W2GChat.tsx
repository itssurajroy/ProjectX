
// src/components/watch2gether/W2GChat.tsx
'use client';

import { collection, query, orderBy, serverTimestamp, addDoc } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase, useCollection, addDocumentNonBlocking } from '@/firebase';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { ChatMessage } from '@/types/watch2gether';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

export default function W2GChat({ roomId }: { roomId: string }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [message, setMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    
    const messagesRef = useMemoFirebase(() => collection(firestore, 'watch2gether_rooms', roomId, 'messages'), [firestore, roomId]);
    const messagesQuery = useMemoFirebase(() => query(messagesRef, orderBy('timestamp', 'asc')), [messagesRef]);

    const {data: messages, isLoading, error} = useCollection<ChatMessage>(messagesQuery);
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !messagesRef) return;

        const messageData = {
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
            text: message,
            timestamp: serverTimestamp(),
        };

        addDocumentNonBlocking(messagesRef, messageData);
        setMessage('');
    };

    return (
        <div className="flex-1 flex flex-col h-full">
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
                                <p className="text-sm bg-muted/50 p-2 rounded-lg max-w-full break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 flex gap-2">
                <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
