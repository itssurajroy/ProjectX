
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function PollsSection({ animeId, episodeId }: { animeId: string; episodeId: string | null}) {
  const pollOptions = ['🤯 Mind-blown', '😍 Loved it', '😊 Good', '🤔 Meh', '😠 Awful'];
  
  return (
    <Card className="p-4 bg-card/50 mb-6">
      <h2 className="font-bold text-lg mb-3">📊 Rate this episode</h2>
      <div className="flex flex-wrap gap-2">
        {pollOptions.map(option => {
          return (
            <button
              key={option}
              disabled={true}
              className="flex-1 min-w-[80px] p-2 rounded-md bg-muted/50 hover:bg-muted disabled:cursor-not-allowed relative overflow-hidden text-center"
            >
              <span className="relative z-10 text-sm font-semibold">{option}</span>
            </button>
          )
        })}
      </div>
        <p className="text-center text-sm text-muted-foreground pt-4">Login to vote.</p>
    </Card>
  )
}
