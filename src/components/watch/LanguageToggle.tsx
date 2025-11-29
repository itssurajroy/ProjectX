
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type Language = 'sub' | 'dub';

interface LanguageToggleProps {
  onLanguageChange: (language: Language) => void;
}

export default function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
  const [language, setLanguage] = useState<Language>('sub');

  const handleLanguageClick = (lang: Language) => {
    setLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <div className='flex items-center gap-1 text-sm'>
      <p className="mr-2 font-semibold">Language:</p>
      <Button 
        size="sm" 
        variant={language === "sub" ? 'default' : 'secondary'} 
        className='font-semibold' 
        onClick={() => handleLanguageClick("sub")}
      >
        Sub
      </Button>
      <Button 
        size="sm" 
        variant={language === "dub" ? 'default' : 'secondary'} 
        className='font-semibold' 
        onClick={() => handleLanguageClick("dub")}
      >
        Dub
      </Button>
    </div>
  );
}
