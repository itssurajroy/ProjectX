
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShieldCheck, ChevronsDown } from 'lucide-react';
import { Button } from '../ui/button';
import CommentSection from '../CommentSection';

interface CommentsContainerProps {
  animeId: string;
  episodeId?: string | null;
}

const CommentRules = () => (
    <div className="bg-card/70 border border-border/50 rounded-lg p-4 mb-6 text-sm">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-primary"><ShieldCheck className="w-5 h-5"/> PROJECT X COMMENT RULES (Read or get banned)</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-xs [&_strong]:text-foreground/90">
            <li><strong>Be respectful</strong> — no personal attacks, racism, homophobia, death threats, doxxing, or harassment. Instant permanent ban.</li>
            <li><strong>No spoilers without warning</strong>. Use spoiler tags for new episodes. Repeated abuse = ban.</li>
            <li><strong>No illegal links or piracy discussion</strong>. No asking “where to download”, no torrent links. This is a streaming site, not a warehouse.</li>
            <li><strong>No excessive spam</strong>, copypasta, or all-caps screaming. Chill. We can hear you.</li>
            <li><strong>No advertising or self-promo</strong> in comments. Your own site, Discord, YouTube, TikTok, etc. → banned.</li>
            <li><strong>English only</strong> in main comment section. Other languages → use the translation button or go to your country’s mirror.</li>
            <li><strong>No political or religious debates</strong>. Take that somewhere else.</li>
            <li><strong>No impersonating staff</strong> or other users.</li>
            <li><strong>Report &gt; argue</strong>. See something bad? Use the report button. Don’t start fights.</li>
            <li><strong>Bans are final</strong>. No begging in DMs or alt accounts. We see everything.</li>
        </ol>
        <div className="mt-4 text-xs text-center space-y-1">
            <p className="font-semibold text-destructive">Break these rules → silent ban. No warning, no appeal.</p>
            <p className="text-muted-foreground">Have fun, talk anime, vibe with the community. That’s why we’re all here.</p>
            <p className="font-bold text-primary">— Project X Mod Team</p>
        </div>
    </div>
);


export default function CommentsContainer({
  animeId,
  episodeId,
}: CommentsContainerProps) {
  const [showComments, setShowComments] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [activeTab, setActiveTab] = useState(episodeId ? 'episode' : 'anime');

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="anime">Anime</TabsTrigger>
              <TabsTrigger value="episode">Episode</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {!showRules && (
        <Button
            variant="outline"
            className="w-full mb-4 gap-2"
            onClick={() => setShowRules(true)}
        >
            <ChevronsDown className="w-4 h-4"/> Show Community Rules
        </Button>
      )}

      {showRules && <CommentRules />}

      {showComments && (
        <>
            {activeTab === 'anime' && <CommentSection animeId={animeId} />}
            {activeTab === 'episode' && episodeId && <CommentSection animeId={animeId} episodeId={episodeId} />}
        </>
      )}
    </Card>
  );
}
