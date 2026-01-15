

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, MessageCircle, AlertTriangle, Loader2, Shield, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment, CommentWithUser } from '@/lib/types/comment';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/client/useCollection';
import { db } from '@/firebase/client';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, doc, serverTimestamp, getDocs, limit, runTransaction } from 'firebase/firestore';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { UserProfile } from '@/lib/types/user';
import CommentItem from './CommentItem';

const buildCommentTree = (comments: CommentWithUser[]): CommentWithUser[] => {
    const commentMap: { [id: string]: CommentWithUser } = {};
    const commentTree: CommentWithUser[] = [];

    comments.forEach(comment => {
        comment.replies = [];
        commentMap[comment.id] = comment;
    });

    comments.forEach(comment => {
        if (comment.parentId && commentMap[comment.parentId]) {
            commentMap[comment.parentId].replies.push(comment);
        } else {
            commentTree.push(comment);
        }
    });

    // Sort replies by timestamp
    Object.values(commentMap).forEach(comment => {
        comment.replies.sort((a, b) => (a.timestamp?.toMillis() || 0) - (b.timestamp?.toMillis() || 0));
    });

    return commentTree;
}

export default function CommentSection({ animeId, episodeId }: { animeId: string; episodeId?: string }) {
  const { user, userProfile } = useUser();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [input, setInput] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

   useEffect(() => {
    setIsLoading(true);
    const commentsCol = collection(db, 'comments');
    const q = query(
      commentsCol, 
      where('animeId', '==', animeId), 
      where('episodeId', '==', episodeId || null),
      orderBy('timestamp', 'desc'),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
          setComments([]);
          setIsLoading(false);
          return;
      }
      
      const fetchedComments: Comment[] = [];
      snapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() } as Comment);
      });

      const userIds = [...new Set(fetchedComments.map(c => c.userId))];
      const userProfiles = new Map<string, UserProfile>();
      
      for (let i = 0; i < userIds.length; i += 30) {
        const batchIds = userIds.slice(i, i + 30);
        if(batchIds.length === 0) continue;
        const usersQuery = query(collection(db, 'users'), where('__name__', 'in', batchIds));
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.forEach(doc => {
            userProfiles.set(doc.id, doc.data() as UserProfile);
        });
      }

      const commentsWithProfiles = fetchedComments.map(comment => ({
          ...comment,
          userProfile: userProfiles.get(comment.userId)
      }));
      
      setComments(commentsWithProfiles);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching comments: ", error);
      toast.error("Could not load comments.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [animeId, episodeId]);

  const postComment = async (text: string, parentId: string | null = null) => {
    if (!text.trim() || !user || !userProfile) {
        if (!user) toast.error("You must be logged in to comment.");
        return;
    }

    const toastId = toast.loading("Posting comment...");

    try {
        await addDoc(collection(db, 'comments'), {
            animeId,
            episodeId: episodeId || null,
            userId: user.uid,
            username: userProfile.displayName,
            userAvatar: userProfile.photoURL,
            text,
            spoiler: parentId ? false : isSpoiler, // Replies cannot be spoilers for now
            likes: [],
            timestamp: serverTimestamp(),
            parentId: parentId
        });
        toast.success("Comment posted!", { id: toastId });
        if(!parentId) {
            setInput('');
            setIsSpoiler(false);
        }
    } catch(err: any) {
        toast.error(`Failed to post: ${getFirebaseErrorMessage(err.code)}`, { id: toastId });
    }
  };
  
  const likeComment = async (commentId: string) => {
    if (!user) {
        toast.error("You must be logged in to like comments.");
        return;
    }
    const commentRef = doc(db, 'comments', commentId);

    try {
      await runTransaction(db, async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        if (!commentDoc.exists()) {
          throw "Document does not exist!";
        }
        
        const currentLikes: string[] = commentDoc.data().likes || [];
        let newLikes;
        if(currentLikes.includes(user.uid)) {
          newLikes = arrayRemove(user.uid);
        } else {
          newLikes = arrayUnion(user.uid);
        }
        transaction.update(commentRef, { likes: newLikes });
      });
    } catch (err: any) {
        console.error("Like transaction failed: ", err);
        toast.error(`Action failed: ${err.message || getFirebaseErrorMessage(err.code)}`);
    }
  };

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {user ? (
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userProfile?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} />
            <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a public comment..."
              className="w-full p-4 bg-card/80 rounded-xl border-border/50 resize-none focus:outline-none focus:border-primary"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                  <input type="checkbox" id="isSpoiler" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="form-checkbox h-4 w-4 rounded bg-muted/50 border-border text-primary focus:ring-primary" />
                  <label htmlFor="isSpoiler" className="text-sm text-muted-foreground">Mark as Spoiler</label>
              </div>
              <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => {setInput(''); setIsSpoiler(false)}}>
                      Cancel
                  </Button>
                  <Button onClick={() => postComment(input)} disabled={!input.trim()}>
                      <Send className="w-4 h-4 mr-2" /> Post
                  </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className="text-center p-6 bg-card/50 border border-dashed border-border/50 rounded-lg">
            <p className="text-muted-foreground">You must be logged in to comment.</p>
             <Button asChild variant="link"><Link href="/login">Login or Sign Up</Link></Button>
          </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        {!isLoading && commentTree.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={likeComment} onReply={postComment} currentUser={user} />
        ))}
        {!isLoading && comments.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <p>Be the first to comment!</p>
            </div>
        )}
      </div>
    </div>
  );
}
