
'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import Image from 'next/image';
import { Loader2, Send } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { sanitizeFirestoreId } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';


export default function CommentsSection({ animeId, episodeId }: { animeId: string; episodeId: string | undefined }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [text, setText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanEpisodeId = sanitizeFirestoreId(episodeId || 'no-episode');

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore || !animeId || !cleanEpisodeId) return null;
    return query(
        collection(firestore, 'comments', animeId, 'episodes', cleanEpisodeId, 'messages'),
        orderBy('createdAt', 'desc')
    );
  }, [firestore, animeId, cleanEpisodeId]);

  useEffect(() => {
    if (!commentsQuery) {
        setComments([]);
        setLoading(false);
        return;
    };
    
    setLoading(true);

    const unsub = onSnapshot(commentsQuery, 
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(data);
        setLoading(false);
      }, 
      (error) => {
        const permissionError = new FirestorePermissionError({
            path: (commentsQuery as any)._query.path.canonicalString(),
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        console.error("Firestore snapshot error:", error);
        setLoading(false);
        setComments([]);
    });

    return () => unsub();
  }, [commentsQuery]);

  const postComment = () => {
    if (!user || user.isAnonymous) {
      toast.error('You must be logged in to comment');
      return;
    }
    if (!text.trim()) return;
    if (!firestore || !animeId || !cleanEpisodeId) return; // Should not happen if user can type

    const newComment = {
      text,
      createdAt: serverTimestamp(),
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`
    };
    
    const collectionRef = collection(firestore, 'comments', animeId, 'episodes', cleanEpisodeId, 'messages');
    addDocumentNonBlocking(collectionRef, newComment);
    setText('');
  };

  return (
    <Card className="bg-card border border-border rounded-xl">
        <CardHeader>
             <CardTitle className="text-2xl font-bold">💬 Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {user && !user.isAnonymous ? (
                <div className="flex gap-4 items-start mb-6">
                <Avatar>
                    <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-muted p-3 rounded-lg border-border focus:ring-primary"
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(); }}}
                    />
                    <div className="flex justify-end mt-2">
                        <Button
                            onClick={postComment}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                        >
                            <Send className="w-4 h-4 mr-2"/>
                            Post
                        </Button>
                    </div>
                </div>
                </div>
            ) : (
                <div className="text-center py-4 bg-muted/50 rounded-lg mb-6">
                    <p className="text-sm text-muted-foreground">
                    You must be <span className='text-primary font-semibold'>logged in</span> to post a comment.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                    </div>
                ) : comments.map((c) => (
                <div key={c.id} className="p-4 bg-muted/50 rounded-lg flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={c.avatar} alt={c.username} />
                        <AvatarFallback>{c.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">{c.username}</p>
                        <p className="text-sm text-muted-foreground" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{c.text}</p>
                    </div>
                </div>
                ))}
                {comments.length === 0 && !loading && (
                <div className="text-center py-10">
                    <p className="text-base text-muted-foreground">Be the first to comment! 🎉</p>
                </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
}


    