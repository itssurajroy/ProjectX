
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function CommentsSection({ animeId, episodeId }: { animeId: string; episodeId: string }) {
  
  return (
    <Card className="p-4 bg-card/50">
      <h2 className="font-bold text-lg mb-3">💬 Comments</h2>
      
      <p className="text-sm text-muted-foreground mb-4">
        Login to view and post comments.
      </p>

      <div className="space-y-3">
        <p className="text-center text-sm text-muted-foreground py-4">Comments are disabled.</p>
      </div>
    </Card>
  );
}
