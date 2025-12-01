
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Language } from './LanguageToggle';

interface ServerToggleProps {
  onLanguageChange: (language: Language) => void;
  // This would come from an API in a real app
  servers?: {
      sub: string[],
      dub: string[],
  }
}

export default function ServerToggle({ onLanguageChange }: ServerToggleProps) {
  const [language, setLanguage] = useState<Language>('sub');
  const [activeServer, setActiveServer] = useState<string>('Server 1');

  const handleLanguageClick = (lang: Language) => {
    setLanguage(lang);
    onLanguageChange(lang);
    // Reset to first server of that language
    setActiveServer('Server 1');
  };
  
  const servers = {
      sub: ['Server 1', 'Server 2'],
      dub: ['Server 1', 'Server 2'],
  }
  const currentServers = servers[language] || [];

  return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-background border border-border">
             <Button 
                size="sm" 
                variant={language === "sub" ? 'secondary' : 'ghost'} 
                className='font-semibold text-xs' 
                onClick={() => handleLanguageClick("sub")}
             >
                 Hard Sub
            </Button>
             <Button 
                size="sm" 
                variant={'ghost'} 
                className='font-semibold text-xs text-muted-foreground'
                disabled
             >
                 Soft Sub
            </Button>
            <Button 
                size="sm" 
                variant={language === "dub" ? 'secondary' : 'ghost'} 
                className='font-semibold text-xs' 
                onClick={() => handleLanguageClick("dub")}
            >
                Dub
            </Button>
        </div>

        <div className='flex items-center gap-2 text-sm flex-wrap'>
            {currentServers.map(server => (
                 <Button 
                    key={server} 
                    size="sm" 
                    variant={activeServer === server ? 'default' : 'secondary'} 
                    className='font-semibold capitalize'
                    onClick={() => setActiveServer(server)}
                >
                    {server}
                </Button>
            ))}
        </div>
    </div>
  );
}
