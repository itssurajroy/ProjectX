
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShieldCheck, ChevronsDown, Loader2, MessageCircle, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, getDocs, runTransaction, doc, arrayUnion, arrayRemove, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Comment, CommentWithUser } from '@/lib/types/comment';
import { UserProfile } from '@/lib/types/user';
import toast from 'react-hot-toast';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import CommentItem from './CommentItem';

const CommentRules = () => (
    <div className="bg-card/70 border border-border/50 rounded-lg p-4 mb-6 text-sm">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-primary"><ShieldCheck className="w-5 h-5"/> PROJECT X COMMENT RULES (Read or get banned)</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-xs [&_strong]:text-foreground/90">
            <li><strong>Be respectful</strong> — no personal attacks, racism, homophobia, death threats, doxxing, or harassment. Instant permanent ban.</li>
            <li><strong>No spoilers without warning</strong>. Use spoiler tags for new episodes. Repeated abuse = ban.</li>
            <li><strong>No illegal links or piracy discussion</strong>. No asking “where to download”, no torrent links. This is a streaming site, not a warehouse.</li>
            <li><strong>No excessive spam</strong>, copypasta, or all-caps screaming. Chill. We can hear you.</li>
            <li><strong>No advertising or self-promo</strong> in comments. Your own site, Discord, YouTube, TikTok, etc. → banned.</li>
            <li><strong>English only</strong> in main comment section. Other languages → use the translation button or go to your country’s mirror.</li>
            <li><strong>No political or religious debates</strong>. Take that somewhere else.</li>
            <li><strong>No impersonating staff</strong> or other users.</li>
            <li><strong>Report &gt; argue</strong>. See something bad? Use the report button. Don’t start fights.</li>
            <li><strong>Bans are final</strong>. No begging in DMs or alt accounts. We see everything.</li>
        </ol>
        <div className="mt-4 text-xs text-center space-y-1">
            <p className="font-semibold text-destructive">Break these rules → silent ban. No warning, no appeal.</p>
            <p className="text-muted-foreground">Have fun, talk anime, vibe with the community. That’s why we’re all here.</p>
            <p className="font-bold text-primary">— Project X Mod Team</p>
        </div>
    </div>
);

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

    Object.values(commentMap).forEach(comment => {
        comment.replies.sort((a, b) => (a.timestamp?.toMillis() || 0) - (b.timestamp?.toMillis() || 0));
    });

    return commentTree;
}

const CommentContent = ({ animeId, episodeId }: { animeId: string; episodeId?: string | null; }) => {
    const { user, userProfile } = useUser();
    const firestore = useFirestore();
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [input, setInput] = useState('');
    const [isSpoiler, setIsSpoiler] = useState(false);

    const commentsCol = collection(firestore, 'comments');
    const q = query(
        commentsCol,
        where('animeId', '==', animeId),
        where('episodeId', '==', episodeId || null)
    );

    // This is not a hook, so direct snapshot usage is okay here
    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                setComments([]);
                setIsLoading(false);
                return;
            }

            const fetchedComments: Comment[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
            const userIds = [...new Set(fetchedComments.map(c => c.userId))];
            const userProfiles = new Map<string, UserProfile>();

            for (let i = 0; i < userIds.length; i += 30) {
                const batchIds = userIds.slice(i, i + 30);
                if (batchIds.length > 0) {
                    const usersQuery = query(collection(firestore, 'users'), where('__name__', 'in', batchIds));
                    const usersSnapshot = await getDocs(usersQuery);
                    usersSnapshot.forEach(doc => {
                        userProfiles.set(doc.id, doc.data() as UserProfile);
                    });
                }
            }

            const commentsWithProfiles: CommentWithUser[] = fetchedComments.map(comment => ({
                ...comment,
                userProfile: userProfiles.get(comment.userId),
                replies: []
            }));
            
            // Sort client-side to avoid needing a composite index
            commentsWithProfiles.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));

            setComments(commentsWithProfiles);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching comments: ", error);
            toast.error("Could not load comments.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, animeId, episodeId]); // firestore dependency is important

    const postComment = async (text: string, parentId: string | null = null) => {
        if (!text.trim() || !user || !userProfile) {
            if (!user) toast.error("You must be logged in to comment.");
            return;
        }

        const toastId = toast.loading("Posting comment...");
        try {
            const collectionRef = collection(firestore, 'comments');
            await addDocumentNonBlocking(collectionRef, {
                animeId,
                episodeId: episodeId || null,
                userId: user.uid,
                username: userProfile.displayName,
                userAvatar: userProfile.photoURL,
                text,
                spoiler: parentId ? false : isSpoiler,
                likes: [],
                timestamp: serverTimestamp(),
                parentId: parentId
            });
            toast.success("Comment posted!", { id: toastId });
            if (!parentId) {
                setInput('');
                setIsSpoiler(false);
            }
        } catch (err: any) {
            toast.error(`Failed to post: ${getFirebaseErrorMessage(err.code)}`, { id: toastId });
        }
    };

    const likeComment = async (commentId: string) => {
        if (!user) {
            toast.error("You must be logged in to like comments.");
            return;
        }
        const commentRef = doc(firestore, 'comments', commentId);
        try {
            await runTransaction(firestore, async (transaction) => {
                const commentDoc = await transaction.get(commentRef);
                if (!commentDoc.exists()) throw "Document does not exist!";
                
                const currentLikes: string[] = commentDoc.data().likes || [];
                const newLikes = currentLikes.includes(user.uid) ? arrayRemove(user.uid) : arrayUnion(user.uid);
                transaction.update(commentRef, { likes: newLikes });
            });
        } catch (err: any) {
            console.error("Like transaction failed: ", err);
            toast.error(`Action failed: ${err.message || getFirebaseErrorMessage(err.code)}`);
        }
    };

    const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
    
    return (
        <div className="space-y-6 mt-4">
            {user ? (
                <div className="flex gap-3">
                    <Avatar className="w-10 h-10"><AvatarImage src={userProfile?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`} /><AvatarFallback>{userProfile?.displayName?.charAt(0) || 'U'}</AvatarFallback></Avatar>
                    <div className="flex-1">
                        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a public comment..." className="w-full p-4 bg-card/80 rounded-xl border-border/50 resize-none" rows={3} />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isSpoiler" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="form-checkbox h-4 w-4 rounded bg-muted/50 border-border text-primary focus:ring-primary" />
                                <label htmlFor="isSpoiler" className="text-sm text-muted-foreground">Mark as Spoiler</label>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => {setInput(''); setIsSpoiler(false)}}>Cancel</Button>
                                <Button onClick={() => postComment(input)} disabled={!input.trim()}><Send className="w-4 h-4 mr-2" /> Post</Button>
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

            <div className="space-y-4">
                {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
                {!isLoading && commentTree.map((comment) => <CommentItem key={comment.id} comment={comment} onLike={likeComment} onReply={postComment} currentUser={user} currentUserProfile={userProfile} />)}
                {!isLoading && comments.length === 0 && <div className="text-center py-10 text-muted-foreground"><p>Be the first to comment!</p></div>}
            </div>
        </div>
    )
}


export default function CommentsContainer({ animeId, episodeId }: { animeId: string; episodeId?: string | null; }) {
  const [showComments, setShowComments] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [activeTab, setActiveTab] = useState(episodeId ? 'episode' : 'anime');

  return (
    <Card className="bg-card/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5" /> COMMENTS</h2>
          <div className="flex items-center space-x-2">
            <Switch id="comments-toggle" checked={showComments} onCheckedChange={setShowComments} aria-label="Toggle comments" />
            <Label htmlFor="comments-toggle" className="text-xs text-muted-foreground">{showComments ? 'ON' : 'OFF'}</Label>
          </div>
        </div>
        {episodeId && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="episode">Episode</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {!showRules && <Button variant="outline" className="w-full mb-4 gap-2" onClick={() => setShowRules(true)}><ChevronsDown className="w-4 h-4"/> Show Community Rules</Button>}
      {showRules && <CommentRules />}
      
      {showComments && (
        <Tabs value={activeTab} className="w-full">
            <TabsContent value="anime">
                <CommentContent animeId={animeId} />
            </TabsContent>
            <TabsContent value="episode">
                <CommentContent animeId={animeId} episodeId={episodeId} />
            </TabsContent>
        </Tabs>
      )}
    </Card>
  );
}
