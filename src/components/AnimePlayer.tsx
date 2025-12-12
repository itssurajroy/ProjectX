
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Loader2, ServerCrash } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';
import { usePlayerSettings } from '@/store/player-settings';
import Confetti from 'react-confetti';
import { useUser } from '@/firebase/auth/use-user';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { sanitizeFirestoreId } from '@/lib/utils';
import Link from 'next/link';

export default function AnimePlayer({ episodeId, episodeNumber, animeId, onNext }: { episodeId: string; episodeNumber: string; animeId: string; onNext: () => void }) {
  const { user } = useUser();
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

  const saveHistory = useCallback(async () => {
    if (!user || !videoRef.current || !episodeId) return;
    const { currentTime, duration } = videoRef.current;
    if (isNaN(duration) || duration === 0) return;

    const historyDocId = sanitizeFirestoreId(episodeId);
    const historyRef = doc(db, `users/${user.uid}/history`, historyDocId);

    try {
      await setDoc(historyRef, {
        id: historyDocId,
        animeId: animeId,
        episodeId: episodeId,
        episodeNumber: Number(episodeNumber),
        watchedAt: serverTimestamp(),
        progress: currentTime,
        duration: duration,
      }, { merge: true });
    } catch(err) {
      console.error("Failed to save watch history:", err);
    }
  }, [user, animeId, episodeId, episodeNumber]);

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

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('pause', saveHistory);
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


  if (!episodeNumber) {
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
  const iframeUrl = `https://megaplay.buzz/stream/s-2/${episodeNumber}/sub`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {showConfetti && windowSize.width && windowSize.height && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} />}
        <iframe
            src={iframeUrl}
            allowFullScreen
            className="w-full h-full border-0"
            scrolling="no"
            title="Anime Player"
            ref={videoRef as any} // The ref is for history tracking, might not work perfectly with iframe
        ></iframe>
        <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
            Powered by <Link href="/" className="font-bold text-primary hover:underline">{SITE_NAME}</Link>
        </div>
    </div>
  );
}
