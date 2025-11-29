
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EpisodeServer } from '@/types/anime';

interface ServerToggleProps {
  servers: EpisodeServer[];
  activeServer: string | null;
  onServerChange: (server: string) => void;
}

export default function ServerToggle({ servers, activeServer, onServerChange }: ServerToggleProps) {
  const handleServerClick = (serverId: string) => {
    onServerChange(serverId);
  }

  if (!servers || servers.length === 0) {
    return (
        <div className='flex items-center gap-1 text-sm'>
            <p className="mr-2 font-semibold">Servers:</p>
            <p className="text-muted-foreground text-xs">No servers available.</p>
        </div>
    );
  }

  return (
    <div className='flex items-center gap-1 text-sm flex-wrap'>
        <p className="mr-2 font-semibold">Servers:</p>
        {servers.map(server => (
             <Button 
                key={server.serverName} 
                size="sm" 
                variant={activeServer === server.serverName ? 'default' : 'secondary'} 
                className='font-semibold capitalize'
                onClick={() => handleServerClick(server.serverName)}
            >
                {server.serverName}
            </Button>
        ))}
    </div>
  );
}
