'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Loader2, ServerCrash } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';
import { usePlayerSettings } from '@/store/player-settings';
import Confetti from 'react-confetti';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { sanitizeFirestoreId } from '@/lib/utils';
import Link from 'next/link';

export default function AnimePlayer({ hianimeEpisodeId, episodeId, episodeNumber, animeId, onNext }: { hianimeEpisodeId: string; episodeId: string; episodeNumber: string; animeId: string; onNext: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const { autoNext } = usePlayerSettings();
  const updateProgressTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveHistory = useCallback(() => {
    if (!user || !videoRef.current || !episodeId) return;
    const { currentTime, duration } = videoRef.current;
    if (isNaN(duration) || duration === 0) return;

    const historyDocId = sanitizeFirestoreId(episodeId);
    const historyRef = doc(firestore, `users/${user.uid}/history`, historyDocId);

    setDocumentNonBlocking(historyRef, {
      id: historyDocId,
      animeId: animeId,
      episodeId: episodeId,
      episodeNumber: Number(episodeNumber),
      watchedAt: serverTimestamp(),
      progress: currentTime,
      duration: duration,
    }, { merge: true });
    
  }, [user, firestore, animeId, episodeId, episodeNumber]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (updateProgressTimeout.current) {
        clearTimeout(updateProgressTimeout.current);
      }
      updateProgressTimeout.current = setTimeout(saveHistory, 15000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('pause', saveHistory);
    window.addEventListener('beforeunload', saveHistory);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('pause', saveHistory);
      window.removeEventListener('beforeunload', saveHistory);
      if (updateProgressTimeout.current) {
        clearTimeout(updateProgressTimeout.current);
      }
      saveHistory();
    };
  }, [saveHistory]);


  const handleEpisodeEnd = useCallback(() => {
    saveHistory(); 
    if (autoNext) {
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
            onNext();
        }, 3000); 
    }
  }, [autoNext, onNext, saveHistory]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('ended', handleEpisodeEnd);
    return () => {
        video.removeEventListener('ended', handleEpisodeEnd);
    }
  }, [handleEpisodeEnd]);


  if (!hianimeEpisodeId) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center p-4 z-10">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h3 className="text-xl font-bold text-destructive">Could Not Load Player</h3>
        <p className="text-muted-foreground mt-2">Invalid episode identifier.</p>
      </div>
    );
  }

  // Simplified to always use the iframe.
  // The category (sub/dub) could be a prop in the future.
  const iframeUrl = `https://megaplay.buzz/stream/s-2/${hianimeEpisodeId}/sub`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {showConfetti && windowSize.width && windowSize.height && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} />}
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
