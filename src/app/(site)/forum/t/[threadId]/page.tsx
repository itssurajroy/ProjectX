
// src/app/forum/t/[threadId]/page.tsx
'use client';

import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Loader2, MessageCircle, Eye, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ForumThread {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName?: string;
    authorAvatar?: string;
    createdAt: any;
}

interface ForumReply {
    id: string;
    content: string;
    authorId: string;
    authorName?: string;
    authorAvatar?: string;
    createdAt: any;
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
            { label: "Category", href: `/forum/c/${thread.categoryId}` }, // Assuming categoryId exists
            { label: thread.title }
        ]}/>
      <h1 className="text-3xl font-bold text-glow my-6">{thread.title}</h1>

      <div className="space-y-4">
        {allPosts.map((post, index) => (
            <div key={post.id} id={post.id} className="flex gap-4 p-4 bg-card/40 border border-border/50 rounded-lg">
                <Avatar className="hidden sm:block w-14 h-14">
                    <AvatarImage src={post.authorAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${post.authorId}`} />
                    <AvatarFallback>{post.authorName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Avatar className="sm:hidden w-8 h-8">
                                <AvatarImage src={post.authorAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${post.authorId}`} />
                                <AvatarFallback>{post.authorName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                               <p className="font-bold text-primary">{post.authorName || 'User'}</p>
                               <p className="text-xs text-muted-foreground">{formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none mt-3" dangerouslySetInnerHTML={{ __html: post.content }} />

                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary"><ThumbsUp className="w-4 h-4"/> 0</button>
                        <button className="flex items-center gap-1 hover:text-primary"><ThumbsDown className="w-4 h-4"/> 0</button>
                        <button className="flex items-center gap-1 hover:text-primary"><Reply className="w-4 h-4"/> Reply</button>
                    </div>
                </div>
            </div>
        ))}
         {isLoadingReplies && <PostSkeleton />}
      </div>
    </div>
  );
}

