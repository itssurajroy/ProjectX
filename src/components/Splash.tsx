
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Splash = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  if (!isMounted || !showSplash) {
    return null;
  }

  return (
    <div 
        className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-1000",
            showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ animation: 'splash-fade-out 1s ease-in-out 3s forwards' }}
    >
      <style jsx>{`
        @keyframes splash-fade-out {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
      <div 
        className="text-6xl font-bold text-glow"
        style={{ animation: 'splash-pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)' }}
      >
        <span className="text-white">ProjectX</span>
      </div>
    </div>
  );
};

export default Splash;
