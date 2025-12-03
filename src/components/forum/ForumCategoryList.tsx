
// src/components/forum/ForumCategoryList.tsx
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  threadCount: number;
  postCount: number;
}

const CategorySkeleton = () => (
    <div className="space-y-4">
        {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-md" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-1/3 bg-muted rounded-md" />
                    <div className="h-4 w-2/3 bg-muted rounded-md" />
                </div>
                 <div className="w-24 h-8 bg-muted rounded-md" />
            </div>
        ))}
    </div>
)

export default function ForumCategoryList() {
  const firestore = useFirestore();
  const categoriesRef = useMemoFirebase(
    () => collection(firestore, 'forum_categories'),
    [firestore]
  );
  const categoriesQuery = useMemoFirebase(
    () => query(categoriesRef, orderBy('name', 'asc')),
    [categoriesRef]
  );

  const {
    data: categories,
    isLoading,
    error,
  } = useCollection<ForumCategory>(categoriesQuery);

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        Error loading categories: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories?.map((category) => (
        <Link
          key={category.id}
          href={`/forum/c/${category.slug}`}
          className="block"
        >
          <div className="p-4 bg-card/50 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <MessageSquare className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                 </div>
              </div>
              <div className="hidden sm:flex items-center gap-8 text-center">
                <div>
                  <p className="font-bold text-lg">{category.threadCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Threads</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{category.postCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
