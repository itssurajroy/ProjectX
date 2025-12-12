
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/lib/types/comment';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import Spoiler from './comments/Spoiler';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CommentSection({ animeId, episodeId }: { animeId: string; episodeId?: string }) {
  const user = null; // Mock user
  const userProfile = null; // Mock user profile
  const comments: Comment[] = [];
  const isLoading = false;

  const [input, setInput] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  const postComment = async () => {
    if (!input.trim() || !user || !userProfile) {
        if (!user) toast.error("You must be logged in to comment.");
        return;
    }
    toast.error("Commenting is temporarily disabled.");
  };
  
  const likeComment = async (id: string) => {
    if (!user) {
        toast.error("You must be logged in to like comments.");
        return;
    }
    toast.error("Liking is temporarily disabled.");
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
