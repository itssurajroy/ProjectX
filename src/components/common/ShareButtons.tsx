'use client';

import { Twitter, Facebook, Rss, Link as LinkIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState('');

  // We use useEffect to safely access window.location on the client
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) {
    // Render a disabled placeholder on the server and during initial client render
    return (
        <Button variant="secondary" size="lg" className="gap-2" disabled>
            <Share2 className="w-4 h-4" />
            Share
        </Button>
    );
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title} on ProjectX!`)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`Check out ${title} on ProjectX!`)}`;

  const handleCopyLink = (e: Event) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="lg" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem asChild>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer w-full">
                  <Twitter className="w-4 h-4" /> Share on Twitter
                </a>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer w-full">
                  <Facebook className="w-4 h-4" /> Share on Facebook
                </a>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <a href={redditUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer w-full">
                  <Rss className="w-4 h-4" /> Share on Reddit
                </a>
            </DropdownMenuItem>
             <DropdownMenuItem onSelect={handleCopyLink} className="flex items-center gap-2 cursor-pointer">
                <LinkIcon className="w-4 h-4" /> Copy Link
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
