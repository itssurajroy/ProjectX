
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ServerToggleProps {
  onServerChange: (server: string) => void;
}

const servers = [
    { id: 'megacloud', name: 'MegaCloud' },
    { id: 'vidplay', name: 'VidPlay' },
    { id: 'streamlare', name: 'StreamLare' },
];

export default function ServerToggle({ onServerChange }: ServerToggleProps) {
  const [activeServer, setActiveServer] = useState(servers[0].id);

  const handleServerClick = (serverId: string) => {
    setActiveServer(serverId);
    onServerChange(serverId);
  }

  return (
    <div className='flex items-center gap-1 text-sm'>
        <p className="mr-2 font-semibold">Servers:</p>
        {servers.map(server => (
             <Button 
                key={server.id} 
                size="sm" 
                variant={activeServer === server.id ? 'default' : 'secondary'} 
                className='font-semibold'
                onClick={() => handleServerClick(server.id)}
            >
                {server.name}
            </Button>
        ))}
    </div>
  );
}
