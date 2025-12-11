
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
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { initializeFirebase, useFirestore, useUser } from '@/firebase';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';
import Spoiler from './Spoiler';


interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: any;
  avatar: string;
  isSpoiler?: boolean;
}

export default function AnimeComments({ animeId }: { animeId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const firestore = useFirestore();
  const { user } = useUser();

  const commentsRef = useMemo(() => {
    if (!firestore) return null;
    return collection(
      firestore,
      'comments',
      animeId,
      'general'
    );
  }, [animeId, firestore]);

  useEffect(() => {
    if (!commentsRef) return;
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
    if (newComment.trim() === '' || !commentsRef || !user) {
        if (!user) {
            alert("You must be logged in to comment.");
        }
        return;
    }

    const commentData = {
      author: user.displayName || 'Anonymous',
      text: newComment,
      timestamp: serverTimestamp(),
      avatar: user.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.uid}`,
      isSpoiler: isSpoiler,
    };
    
    try {
        await addDoc(commentsRef, commentData);
        setNewComment('');
        setIsSpoiler(false);
    } catch(e) {
        console.error("Error posting comment", e);
        alert("Failed to post comment. You may not have permission.");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={user?.photoURL || `https://api.dicebear.com/8.x/identicon/svg?seed=anonymous`} />
          <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Add a comment about this anime..." : "Please log in to comment."}
            className="mb-2"
            disabled={!user}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="spoiler-anime" checked={isSpoiler} onCheckedChange={(checked) => setIsSpoiler(checked as boolean)} disabled={!user} />
              <Label htmlFor="spoiler-anime" className="text-xs text-muted-foreground">Mark as spoiler</Label>
            </div>
            <Button onClick={handlePostComment} size="sm" disabled={!user || !newComment.trim()}>
              Post Comment
            </Button>
          </div>
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
               {comment.isSpoiler ? (
                <Spoiler>
                  <p className="text-sm">{comment.text}</p>
                </Spoiler>
              ) : (
                <p className="text-sm">{comment.text}</p>
              )}
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
