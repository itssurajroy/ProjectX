'use client';

import { useEffect } from 'react';
import { ServerCrash } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { sanitizeFirestoreId } from '@/lib/utils';
import Link from 'next/link';

// NOTE: onNext is removed from props as we can't detect when an iframe video ends to auto-play the next episode.
export default function AnimePlayer({ hianimeEpisodeId, episodeId, episodeNumber, animeId }: { hianimeEpisodeId: string; episodeId: string; episodeNumber: string; animeId: string; onNext?: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    // If the user is logged in, record that they started watching this episode.
    if (!user || !episodeId) return;

    const historyDocId = sanitizeFirestoreId(episodeId);
    const historyRef = doc(firestore, `users/${user.uid}/history`, historyDocId);

    // This is a "fire-and-forget" write. We don't block rendering for it.
    // We mark progress as 0 and duration as 1 to indicate the episode has been started.
    // Real progress tracking is not possible with the current iframe-based player.
    setDocumentNonBlocking(historyRef, {
      id: historyDocId,
      animeId: animeId,
      episodeId: episodeId,
      episodeNumber: Number(episodeNumber),
      watchedAt: serverTimestamp(),
      progress: 0,
      duration: 1, // Placeholder to indicate "started" but not track progress
    }, { merge: true }); // Merge to avoid overwriting more accurate data if it ever exists.

  }, [user, firestore, animeId, episodeId, episodeNumber]);


  if (!hianimeEpisodeId) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center p-4 z-10">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h3 className="text-xl font-bold text-destructive">Could Not Load Player</h3>
        <p className="text-muted-foreground mt-2">Invalid episode identifier.</p>
      </div>
    );
  }

  // The category (sub/dub) could be a prop in the future.
  const iframeUrl = `https://megaplay.buzz/stream/s-2/${hianimeEpisodeId}/sub`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
            src={iframeUrl}
            allow="picture-in-picture; fullscreen; autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full border-0"
            scrolling="no"
            title="Anime Player"
        ></iframe>
        <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
            Powered by <Link href="/" className="font-bold text-primary hover:underline">{SITE_NAME}</Link>
        </div>
    </div>
  );
}
