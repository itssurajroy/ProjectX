
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnimeComments from './AnimeComments';
import EpisodeComments from './EpisodeComments';
import { AnimeEpisode } from '@/types/anime';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface CommentsContainerProps {
  animeId: string;
  episodeId?: string | null;
  availableEpisodes?: AnimeEpisode[];
}

export default function CommentsContainer({
  animeId,
  episodeId,
  availableEpisodes,
}: CommentsContainerProps) {
  const [showComments, setShowComments] = useState(true);
  const defaultTab = episodeId ? 'episode' : 'anime';

  return (
    <Card className="bg-card/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">COMMENTS</h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="comments-toggle"
              checked={showComments}
              onCheckedChange={setShowComments}
              aria-label="Toggle comments"
            />
            <Label htmlFor="comments-toggle" className="text-xs text-muted-foreground">
              {showComments ? 'ON' : 'OFF'}
            </Label>
          </div>
        </div>

        {episodeId && (
          <Tabs defaultValue={defaultTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="episode">Episode</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

       <Alert className="bg-primary/5 border-primary/20 text-primary-foreground mb-6">
          <AlertTriangle className="h-4 w-4 !text-primary" />
          <AlertTitle className="text-sm !text-primary/90 font-semibold">Note</AlertTitle>
          <AlertDescription className="text-xs !text-primary/80">
            Please take a moment to read the <Link href="/rules" className="underline font-bold">comment rules</Link> before posting.
          </AlertDescription>
        </Alert>

      {showComments && (
        <>
          {episodeId ? (
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsContent value="anime" className="m-0">
                <AnimeComments animeId={animeId} />
              </TabsContent>
              <TabsContent value="episode" className="m-0">
                <EpisodeComments
                  animeId={animeId}
                  episodeId={episodeId}
                  availableEpisodes={availableEpisodes || []}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <AnimeComments animeId={animeId} />
          )}
        </>
      )}
    </Card>
  );
}
