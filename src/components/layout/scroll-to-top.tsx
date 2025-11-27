'use client';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 transition-opacity duration-300 z-50',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}
