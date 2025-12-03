
// src/app/forum/t/[threadId]/page.tsx
'use client';

import { useFirestore, useDoc, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, orderBy, updateDoc, increment } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Loader2, ThumbsUp, ThumbsDown, Reply, BadgeCheck } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface ForumThread {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName?: string;
    authorAvatar?: string;
    createdAt: any;
    upvotes: number;
    downvotes: number;
    categoryId: string;
}

interface ForumReply {
    id: string;
    content: string;
    authorId: string;
    authorName?: string;
    authorAvatar?: string;
    createdAt: any;
    upvotes: number;
    downvotes: number;
}

interface UserForumProfile {
  xp: number;
  level: number;
  rank: string;
}

const getRank = (level: number) => {
    if (level <= 9) return 'Newbie Slayer';
    if (level <= 24) return 'Genin Watcher';
    if (level <= 49) return 'Chuunin Analyst';
    if (level <= 79) return 'Jounin Theorist';
    if (level <= 99) return 'Kage of Memes';
    return 'God of Anime';
}

const PostSkeleton = () => (
    <div className="flex gap-4 p-4 animate-pulse">
        <div className="w-12 h-12 bg-muted rounded-full" />
        <div className="flex-1 space-y-3">
            <div className="h-4 w-1/4 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
    </div>
)

const Post = ({ post, postRef }: { post: ForumThread | ForumReply, postRef: any }) => {
    const firestore = useFirestore();
    const { user } = useUser();
    
    const userProfileRef = useMemoFirebase(() => doc(firestore, 'users', post.authorId, 'forumProfile', 'data'), [firestore, post.authorId]);
    const { data: userProfile } = useDoc<UserForumProfile>(userProfileRef);

    const level = userProfile?.level || 1;
    const rank = getRank(level);
    const karma = (post.upvotes || 0) - (post.downvotes || 0);

    const handleVote = (type: 'upvotes' | 'downvotes') => {
        if (!user) {
            // Or show a toast message
            return;
        }
        updateDoc(postRef, {
            [type]: increment(1)
        });
    }

    return (
         <div key={post.id} id={post.id} className="flex gap-4 p-4 bg-card/40 border border-border/50 rounded-lg">
            <div className="flex flex-col items-center gap-2 w-28">
                <Avatar className="w-16 h-16 border-2 border-border">
                    <AvatarImage src={post.authorAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${post.authorId}`} />
                    <AvatarFallback>{post.authorName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-primary text-sm text-center">{post.authorName || 'User'}</p>
                <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground">{rank}</p>
                    <p className="text-xs text-muted-foreground">Level {level}</p>
                </div>
            </div>
            <div className="flex-1 border-l border-border/50 pl-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}</p>
                </div>

                <div className="prose prose-invert prose-sm max-w-none mt-3" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-green-500" onClick={() => handleVote('upvotes')}>
                        <ThumbsUp className="w-4 h-4"/> {post.upvotes || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-red-500" onClick={() => handleVote('downvotes')}>
                        <ThumbsDown className="w-4 h-4"/> {post.downvotes || 0}
                    </Button>
                    <div className="font-bold text-sm">Karma: {karma}</div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary ml-auto"><Reply className="w-4 h-4"/> Reply</Button>
                </div>
            </div>
        </div>
    )
}

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  const firestore = useFirestore();

  const threadRef = useMemoFirebase(() => doc(firestore, 'forum_threads', threadId), [firestore, threadId]);
  const { data: thread, isLoading: isLoadingThread, error: threadError } = useDoc<ForumThread>(threadRef);

  const repliesRef = useMemoFirebase(() => collection(firestore, 'forum_threads', threadId, 'replies'), [firestore, threadId]);
  const repliesQuery = useMemoFirebase(() => query(repliesRef, orderBy('createdAt', 'asc')), [repliesRef]);
  const { data: replies, isLoading: isLoadingReplies, error: repliesError } = useCollection<ForumReply>(repliesQuery);

  if (isLoadingThread) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (threadError || !thread) {
    return <div className="text-center py-20">Error: {threadError?.message || "Thread not found."}</div>;
  }
  
  const allPosts = [thread, ...(replies || [])];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <Breadcrumb items={[
            { label: "Forum", href: "/forum" },
            { label: "Category", href: `/forum/c/${thread.categoryId || 'general'}` },
            { label: thread.title }
        ]}/>
      <h1 className="text-3xl font-bold text-glow my-6">{thread.title}</h1>

      <div className="space-y-4">
        {allPosts.map((post, index) => {
            const postRef = index === 0 ? threadRef : doc(repliesRef, post.id);
            return <Post key={post.id} post={post} postRef={postRef} />
        })}
         {isLoadingReplies && <PostSkeleton />}
      </div>
    </div>
  );
}
