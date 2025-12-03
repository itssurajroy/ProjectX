
// src/app/forum/c/[categorySlug]/page.tsx
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Loader2, MessageCircle, Eye, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Breadcrumb from '@/components/common/Breadcrumb';

interface ForumThread {
    id: string;
    title: string;
    authorId: string;
    authorName?: string; // These will be denormalized or fetched
    authorAvatar?: string;
    createdAt: any;
    replyCount: number;
    viewCount: number;
    lastReplyAt?: any;
    lastReplyBy?: string;
}

const ThreadListSkeleton = () => (
     <div className="space-y-3">
        {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-card/50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-1/4 bg-muted rounded" />
                </div>
                <div className="w-20 h-6 bg-muted rounded" />
            </div>
        ))}
     </div>
)


export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const firestore = useFirestore();

  // In a real app, you'd fetch the category ID from the slug first.
  // For now, we'll assume slug and ID are the same for simplicity.
  const threadsRef = useMemoFirebase(() => collection(firestore, 'forum_threads'), [firestore]);
  const threadsQuery = useMemoFirebase(
    () => query(threadsRef, where('categoryId', '==', categorySlug), orderBy('createdAt', 'desc')),
    [threadsRef, categorySlug]
  );

  const { data: threads, isLoading, error } = useCollection<ForumThread>(threadsQuery);

  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
            { label: "Forum", href: "/forum" },
            { label: categoryName }
        ]}/>

      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold text-glow">{categoryName}</h1>
        <Button asChild>
          <Link href="/forum/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Thread
          </Link>
        </Button>
      </div>

      <div className="bg-card/30 border border-border/50 rounded-lg">
        <div className="px-4 py-3 border-b border-border/50 hidden md:grid grid-cols-12">
            <div className="col-span-7 font-semibold">Thread</div>
            <div className="col-span-2 text-center font-semibold">Stats</div>
            <div className="col-span-3 text-right font-semibold">Last Post</div>
        </div>
        
        {isLoading && <ThreadListSkeleton />}
        
        {!isLoading && error && <p className="p-8 text-center text-destructive">Error loading threads: {error.message}</p>}

        {!isLoading && threads && threads.length > 0 && (
            <div className="space-y-1 p-2">
                {threads.map(thread => (
                     <Link key={thread.id} href={`/forum/t/${thread.id}`} className="block">
                        <div className="grid grid-cols-12 items-center p-3 rounded-md hover:bg-muted/50 transition-colors">
                            <div className="col-span-12 md:col-span-7 flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={thread.authorAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${thread.authorId}`} />
                                    <AvatarFallback>{thread.authorName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <p className="font-semibold truncate">{thread.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        By <span className="font-bold text-primary/80">{thread.authorName || 'User'}</span>, {formatDistanceToNow(thread.createdAt.toDate(), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:flex col-span-2 items-center justify-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1" title="Replies">
                                    <MessageCircle className="w-4 h-4" /> {thread.replyCount || 0}
                                </div>
                                <div className="flex items-center gap-1" title="Views">
                                    <Eye className="w-4 h-4" /> {thread.viewCount || 0}
                                </div>
                            </div>
                             <div className="hidden md:flex col-span-3 flex-col items-end text-right">
                                <p className="text-sm font-semibold">{thread.lastReplyBy || thread.authorName || 'User'}</p>
                                <p className="text-xs text-muted-foreground">
                                    {thread.lastReplyAt ? formatDistanceToNow(thread.lastReplyAt.toDate(), { addSuffix: true }) : 'No replies yet'}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
        
        {!isLoading && threads?.length === 0 && <p className="p-8 text-center text-muted-foreground">No threads in this category yet. Be the first to start a discussion!</p>}

      </div>
    </div>
  );
}
