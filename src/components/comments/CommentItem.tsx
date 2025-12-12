
'use client';
import { useState } from 'react';
import { Heart, MessageCircle, AlertTriangle, Shield, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import Spoiler from './Spoiler';
import { cn } from '@/lib/utils';
import type { User } from 'firebase/auth';
import type { CommentWithUser } from '@/lib/types/comment';
import { formatDistanceToNow } from 'date-fns';

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

const ReplyForm = ({ onReply, commentId, onCancel }: { onReply: (text: string, parentId: string) => void; commentId: string; onCancel: () => void }) => {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = () => {
        if(replyText.trim()) {
            onReply(replyText, commentId);
            setReplyText('');
            onCancel();
        }
    };
    
    return (
        <div className="mt-2 space-y-2">
            <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="bg-background/50"
            />
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={handleSubmit} disabled={!replyText.trim()}>
                    <Send className="w-3 h-3 mr-2" /> Reply
                </Button>
            </div>
        </div>
    );
};


export default function CommentItem ({ comment, onLike, onReply, currentUser, level = 0 }: { comment: CommentWithUser, onLike: (id: string) => void; onReply: (text: string, parentId: string) => void; currentUser: User | null; level?: number }) {
    const [isReplying, setIsReplying] = useState(false);
    
    return (
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.userAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${comment.userId}`} />
            <AvatarFallback>{comment.username?.[0] || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-card/50 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-semibold">{comment.username}</span>
                  {comment.userProfile && <RoleBadge role={comment.userProfile.role} />}
                  <span className="text-xs text-muted-foreground">{comment.timestamp ? formatDistanceToNow(comment.timestamp.toDate(), { addSuffix: true }) : 'Just now'}</span>
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

                <div className="flex items-center gap-4 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)} className={cn("gap-1", currentUser && comment.likes?.includes(currentUser.uid) ? 'text-primary' : 'text-muted-foreground')}>
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{comment.likes?.length || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} className="gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
                {isReplying && <ReplyForm onReply={onReply} commentId={comment.id} onCancel={() => setIsReplying(false)} />}
            </div>

            {comment.replies && comment.replies.length > 0 && level < 5 && (
                 <div className="mt-4 space-y-4 pl-4 border-l-2 border-border/50">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} onLike={onLike} onReply={onReply} currentUser={currentUser} level={level + 1} />
                    ))}
                </div>
            )}
          </div>
        </div>
    )
};
