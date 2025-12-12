
'use client';

import { AnimeAbout } from '@/lib/types/anime';
import { Badge } from '@/components/ui/badge';

interface InfoSidebarProps {
  moreInfo: AnimeAbout['moreInfo'];
}

export default function InfoSidebar({ moreInfo }: InfoSidebarProps) {
  const infoItems = [
    { label: 'Japanese', value: moreInfo.japanese },
    { label: 'Aired', value: moreInfo.aired },
    { label: 'Status', value: moreInfo.status },
    { label: 'MAL Score', value: moreInfo.malscore },
    { label: 'Studios', value: moreInfo.studios },
    { label: 'Country', value: moreInfo.country },
  ];

  return (
    <div className="bg-card/50 p-4 rounded-lg border border-border/50 space-y-3 sticky top-20">
      <h3 className="text-lg font-bold font-display">Details</h3>
      <div className="space-y-2 text-sm">
        {infoItems.map(item => item.value ? (
          <div key={item.label}>
            <span className="font-semibold text-foreground/90">{item.label}: </span>
            <span className="text-muted-foreground">{item.value}</span>
          </div>
        ) : null)}
      </div>
      {moreInfo.genres && moreInfo.genres.length > 0 && (
        <div>
          <h4 className="font-semibold text-foreground/90 mb-2">Genres</h4>
          <div className="flex flex-wrap gap-2">
            {moreInfo.genres.map((genre: string) => (
              <Badge key={genre} variant="secondary" className="bg-primary/10 text-primary/90 border border-primary/20 hover:bg-primary/20">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
