
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: any;
  avatar: string;
}

export default function AnimeComments({ animeId }: { animeId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const commentsRef = useMemo(() => {
    return collection(
      firestore,
      'comments',
      animeId,
      'general',
      'messages'
    );
  }, [animeId]);

  useEffect(() => {
    const q = query(commentsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: Comment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [commentsRef]);

  const handlePostComment = async () => {
    if (newComment.trim() === '') return;

    await addDoc(commentsRef, {
      author: 'Anonymous', // Since auth is removed
      text: newComment,
      timestamp: serverTimestamp(),
      avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=${Math.random()}`,
    });

    setNewComment('');
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=anonymous`} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment about this anime..."
            className="mb-2"
          />
          <Button onClick={handlePostComment} size="sm">
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar>
              <AvatarImage src={comment.avatar} />
              <AvatarFallback>
                {comment.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{comment.author}</p>
                <p className="text-xs text-muted-foreground">
                  {comment.timestamp?.toDate().toLocaleString()}
                </p>
              </div>
              <p className="text-sm">{comment.text}</p>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary">
                  <ThumbsUp className="h-3 w-3" /> 0
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <ThumbsDown className="h-3 w-3" /> 0
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <Reply className="h-3 w-3" /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Be the first to comment on this anime!
          </p>
        )}
      </div>
    </div>
  );
}
