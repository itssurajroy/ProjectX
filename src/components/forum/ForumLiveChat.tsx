
// src/components/forum/ForumLiveChat.tsx
'use client';

import { collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase, useCollection, addDocumentNonBlocking } from '@/firebase';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, Send } from 'lucide-react';
import { ChatMessage } from '@/types/watch2gether';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

export default function ForumLiveChat() {
    const firestore = useFirestore();
    const { user } = useUser();
    const [message, setMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const roomId = "global_forum_chat";
    
    const messagesRef = useMemoFirebase(() => collection(firestore, 'forum_chat'), [firestore]);
    const messagesQuery = useMemoFirebase(() => query(messagesRef, orderBy('timestamp', 'asc')), [messagesRef]);

    const {data: messages, isLoading, error} = useCollection<ChatMessage>(messagesQuery);
    
    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, [messages]);


    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !messagesRef) return;

        const messageData = {
            userId: user.uid,
            userName: user.displayName || 'Anonymous Guest',
            avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
            text: message,
            timestamp: serverTimestamp(),
        };

        addDocumentNonBlocking(messagesRef, messageData);
        setMessage('');
    };

    return (
        <div className="h-[70vh] flex flex-col bg-card/30 border border-border/50 rounded-lg">
             <div className="p-4 border-b border-border/50">
                <h2 className="font-bold text-lg">Forum Live Chat</h2>
                <p className="text-xs text-muted-foreground">Chat with the community in real-time.</p>
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
                    placeholder={user ? "Type a message..." : "Sign in to chat"}
                    autoComplete="off"
                    disabled={!user}
                    className="bg-background/50"
                />
                <Button type="submit" size="icon" disabled={!user}>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
