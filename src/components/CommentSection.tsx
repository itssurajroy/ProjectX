
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, serverTimestamp, query, orderBy, where, doc, updateDoc, arrayUnion, arrayRemove, collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { Heart, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/types/comment';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import Spoiler from './comments/Spoiler';

export default function CommentSection({ animeId, episodeId }: { animeId: string; episodeId?: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    let commentsCollectionPath: string;
    if (episodeId) {
        commentsCollectionPath = `comments/${animeId}/episodes/${episodeId}/messages`;
    } else {
        commentsCollectionPath = `comments/${animeId}/general`;
    }
    const commentsRef = collection(firestore, commentsCollectionPath);

    return query(commentsRef, orderBy('timestamp', 'asc'));
  }, [firestore, animeId, episodeId]);

  const { data: fetchedComments, isLoading } = useCollection<Comment>(commentsQuery);

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);


  const postComment = async () => {
    if (!input.trim() || !user || !firestore || !commentsQuery) {
        if(!user) alert("You must be logged in to comment.");
        return;
    };
    
    const commentData = {
      animeId: animeId,
      text: input,
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      userAvatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
      episodeId: episodeId || null,
      likes: [],
      timestamp: serverTimestamp(),
      spoiler: isSpoiler,
      parentId: null,
      rank: 'Genin', // Placeholder for gamification
    };

    await addDoc(collection(firestore, commentsQuery.path), commentData);
    setInput('');
    setIsSpoiler(false);
  };
  
  const likeComment = async (id: string) => {
    if (!user || !firestore || !commentsQuery) {
        if(!user) alert("You must be logged in to like comments.");
        return;
    }

    const commentRef = doc(firestore, commentsQuery.path, id);
    const comment = comments.find(c => c.id === id);

    if (comment?.likes.includes(user.uid)) {
        await updateDoc(commentRef, {
            likes: arrayRemove(user.uid)
        });
    } else {
        await updateDoc(commentRef, {
            likes: arrayUnion(user.uid)
        });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {user ? (
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} />
            <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your thoughts... Use >!spoiler!< for hidden text"
              className="w-full p-4 bg-card/80 rounded-xl border-border/50 resize-none focus:outline-none focus:border-primary"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                  <input type="checkbox" id="isSpoiler" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="form-checkbox h-4 w-4 rounded bg-muted/50 border-border text-primary focus:ring-primary" />
                  <label htmlFor="isSpoiler" className="text-sm text-muted-foreground">Mark as Spoiler</label>
              </div>
              <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setInput('')}>
                      Cancel
                  </Button>
                  <Button onClick={postComment} disabled={!input.trim()}>
                      Post Comment
                  </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <p className="text-center text-muted-foreground">You must be logged in to comment.</p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading && <p>Loading comments...</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-card/50 rounded-xl p-4 border border-border/50">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback>{comment.username?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{comment.username}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : 'Just now'}</span>
                  {comment.spoiler && (
                    <Badge variant="destructive" className="ml-auto">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Spoiler
                    </Badge>
                  )}
                </div>
                
                {comment.spoiler ? (
                    <Spoiler>
                        <p>{comment.text}</p>
                    </Spoiler>
                ) : (
                    <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                )}

                <div className="flex items-center gap-4 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id)}>
                    <Heart className={cn("w-4 h-4", user && comment.likes?.includes(user.uid) ? "fill-red-500 text-red-500" : "")} />
                    <span className="ml-1 text-xs">{comment.likes?.length || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4" />
                    <span className="ml-1 text-xs">Reply</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
