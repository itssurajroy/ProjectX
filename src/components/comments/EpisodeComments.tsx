
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import { sanitizeFirestoreId } from '@/lib/utils';
import { AnimeEpisode } from '@/lib/types/anime';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import Spoiler from './Spoiler';


interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: any;
  avatar: string;
  isSpoiler?: boolean;
}

interface EpisodeCommentsProps {
  animeId: string;
  episodeId: string;
  availableEpisodes: AnimeEpisode[];
}

export default function EpisodeComments({ animeId, episodeId, availableEpisodes }: EpisodeCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = null; // Mock user since auth is removed

  const currentEpNumber = searchParams.get('ep');

  useEffect(() => {
    // Data fetching logic removed
    setComments([]);
  }, [animeId, episodeId]);

  const handlePostComment = async () => {
    alert("Commenting is temporarily disabled.");
  };

  const handleEpisodeChange = (epNumber: string) => {
    router.push(`/watch/${animeId}?ep=${epNumber}`);
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex gap-4 items-center">
         <p className="text-sm font-semibold">Comments for Episode:</p>
         <Select onValueChange={handleEpisodeChange} value={currentEpNumber || ''}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select EP" />
            </SelectTrigger>
            <SelectContent>
                {availableEpisodes.map(ep => (
                    <SelectItem key={ep.number} value={String(ep.number)}>{ep.number}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=anonymous`} />
          <AvatarFallback>{'G'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Commenting for Episode ${currentEpNumber} is disabled.`}
            className="mb-2"
            disabled={true}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="spoiler-episode" checked={isSpoiler} onCheckedChange={(checked) => setIsSpoiler(checked as boolean)} disabled={true} />
              <Label htmlFor="spoiler-episode" className="text-xs text-muted-foreground">Mark as spoiler</Label>
            </div>
            <Button onClick={handlePostComment} size="sm" disabled={true}>
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
            Be the first to comment on this episode!
          </p>
        )}
      </div>
    </div>
  );
}
