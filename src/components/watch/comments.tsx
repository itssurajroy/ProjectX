'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card } from '@/components/ui/card';
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
        collection(db, 'comments', animeId, 'episodes', cleanEpisodeId, 'messages'),
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
            path: commentsQuery.path,
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
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    if (!text.trim()) return;
    if (!commentsQuery) return; // Should not happen if user can type

    const newComment = {
      text,
      createdAt: serverTimestamp(),
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`
    };
    
    const collectionRef = collection(db, 'comments', animeId, 'episodes', cleanEpisodeId, 'messages');
    addDocumentNonBlocking(collectionRef, newComment);
    setText('');
  };
  
  const db = useFirestore();

  return (
    <Card className="p-4 bg-card/50">
      <h2 className="font-bold text-lg mb-3">💬 Comments ({comments.length})</h2>
      {user ? (
        <div className="flex gap-4 items-start mb-4">
          <Avatar>
            <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} />
            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-muted p-2 rounded-md"
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(); }}}
            />
            <div className="flex justify-end mt-2">
                <Button
                    onClick={postComment}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
                >
                    Post
                </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          You must be <span className='text-primary font-semibold'>logged in</span> to post a comment.
        </p>
      )}

      <div className="space-y-3">
        {loading ? (
             <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
             </div>
        ) : comments.map((c) => (
          <div key={c.id} className="p-3 bg-muted/50 rounded-md flex items-start gap-3">
            <Image src={c.avatar} alt={c.username} width={32} height={32} className="rounded-full mt-1" />
            <div>
                <p className="text-sm font-semibold">{c.username}</p>
                <p className="text-sm text-muted-foreground" style={{ whiteSpace: 'pre-wrap'}}>{c.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && !loading && (
          <p className="text-center text-sm text-muted-foreground py-4">Be the first to comment! 🎉</p>
        )}
      </div>
    </Card>
  );
}
