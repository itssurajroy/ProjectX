
'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { sanitizeFirestoreId } from '@/lib/utils';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CommentsSection({ animeId, episodeId }: { animeId: string; episodeId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [text, setText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanEpisodeId = sanitizeFirestoreId(episodeId);

  useEffect(() => {
    if (!animeId || !cleanEpisodeId || !firestore) return;
    
    setLoading(true);
    setComments([]);

    const commentCollectionRef = collection(firestore, 'comments', animeId, 'episodes', cleanEpisodeId, 'messages');
    const q = query(
      commentCollectionRef,
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(data);
        setLoading(false);
      }, 
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: commentCollectionRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        
        console.error("Firestore snapshot error:", error);
        setLoading(false);
        setComments([]);
    });

    return () => {
        unsub();
    };
  }, [animeId, cleanEpisodeId, firestore]);

  const postComment = async () => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    if (!text.trim()) return;
    if (!firestore) return;

    const commentRef = collection(firestore, 'comments', animeId, 'episodes', cleanEpisodeId, 'messages');
    const newComment = {
      text,
      createdAt: serverTimestamp(),
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`
    };

    try {
        await addDoc(commentRef, newComment);
        setText('');
    } catch(e: any) {
        const permissionError = new FirestorePermissionError({
            path: `${commentRef.path}/<auto-id>`,
            operation: 'create',
            requestResourceData: newComment,
        });
        errorEmitter.emit('permission-error', permissionError);
    }
  };

  return (
    <Card className="p-4 bg-card/50">
      <h2 className="font-bold text-lg mb-3">💬 Comments ({comments.length})</h2>
      {user && !user.isAnonymous ? (
        <div className="flex gap-3 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-muted p-2 rounded-md border-transparent focus:border-primary focus:ring-primary"
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(); }}}
          />
          <button
            onClick={postComment}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          You must <span className='text-primary font-semibold'>log in</span> to post a comment.
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
