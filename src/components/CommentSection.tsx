
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, MessageCircle, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/lib/types/comment';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import Spoiler from './comments/Spoiler';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, doc, serverTimestamp, getDoc, getDocs, limit } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { UserProfile } from '@/lib/types/user';
import { cn } from '@/lib/utils';

const RoleBadge = ({ role }: { role: 'user' | 'moderator' | 'admin' }) => {
    const roleStyles = {
        user: 'hidden', // Don't show a badge for regular users
        moderator: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        admin: 'bg-primary/10 text-primary border-primary/20',
    };
    if (role === 'user') return null;
    return (
        <Badge variant="outline" className={cn('text-xs capitalize', roleStyles[role])}>
            {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
            {role}
        </Badge>
    );
};

const CommentItem = ({ comment, onLike, currentUser }: { comment: Comment & { userProfile?: UserProfile }, onLike: (id: string) => void, currentUser: any }) => (
    <div className="bg-card/50 rounded-xl p-4 border border-border/50">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.userAvatar} />
            <AvatarFallback>{comment.username?.[0] || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold">{comment.username}</span>
              {comment.userProfile && <RoleBadge role={comment.userProfile.role} />}
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
                    <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                </Spoiler>
            ) : (
                <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
            )}

            <div className="flex items-center gap-4 mt-2">
              <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)} className={cn(currentUser && comment.likes?.includes(currentUser.uid) && 'text-primary')}>
                <Heart className="w-4 h-4" />
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
);


export default function CommentSection({ animeId, episodeId }: { animeId: string; episodeId?: string }) {
  const { user, userProfile } = useUser();
  const [comments, setComments] = useState<(Comment & { userProfile?: UserProfile })[]>([]);
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
      limit(50)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedComments: Comment[] = [];
      snapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() } as Comment);
      });

      const userIds = [...new Set(fetchedComments.map(c => c.userId))];
      const userProfiles = new Map<string, UserProfile>();
      
      // Fetch user profiles for commenters in batches
      for (let i = 0; i < userIds.length; i += 10) {
        const batchIds = userIds.slice(i, i + 10);
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

  const postComment = async () => {
    if (!input.trim() || !user || !userProfile) {
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
            text: input,
            spoiler: isSpoiler,
            likes: [],
            timestamp: serverTimestamp(),
            parentId: null
        });
        toast.success("Comment posted!", { id: toastId });
        setInput('');
        setIsSpoiler(false);
    } catch(err: any) {
        toast.error(`Failed to post: ${getFirebaseErrorMessage(err.code)}`, { id: toastId });
    }
  };
  
  const likeComment = async (id: string) => {
    if (!user) {
        toast.error("You must be logged in to like comments.");
        return;
    }
    const commentRef = doc(db, 'comments', id);
    const comment = comments.find(c => c.id === id);

    try {
        if(comment?.likes.includes(user.uid)) {
            await updateDoc(commentRef, { likes: arrayRemove(user.uid) });
        } else {
            await updateDoc(commentRef, { likes: arrayUnion(user.uid) });
        }
    } catch(err: any) {
        toast.error(`Action failed: ${getFirebaseErrorMessage(err.code)}`);
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
          <div className="text-center p-6 bg-card/50 border border-dashed border-border/50 rounded-lg">
            <p className="text-muted-foreground">You must be logged in to comment.</p>
             <Button asChild variant="link"><Link href="/login">Login or Sign Up</Link></Button>
          </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        {!isLoading && comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={likeComment} currentUser={user} />
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
