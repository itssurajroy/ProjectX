
import { AnimeAbout } from '@/types/anime';
import { Badge } from '../ui/badge';
import Link from 'next/link';

const InfoRow = ({ label, value, isLink, linkPrefix }: { label: string; value: string | string[] | undefined, isLink?: boolean, linkPrefix?: string }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    const renderValue = () => {
        if (Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((item, index) => 
                        isLink ? (
                            <Link key={index} href={`${linkPrefix}${item.toLowerCase().replace(/ /g, '-')}`}>
                                <Badge variant="secondary" className="hover:bg-primary/80 transition-colors">{item}</Badge>
                            </Link>
                        ) : (
                             <Badge key={index} variant="secondary">{item}</Badge>
                        )
                    )}
                </div>
            );
        }
        return <span className="text-muted-foreground">{value}</span>;
    };

    return (
        <div className="text-sm">
            <span className="font-bold w-24 inline-block">{label}:</span>
            {renderValue()}
        </div>
    );
};


export default function InfoTable({ anime }: { anime: AnimeAbout }) {
    const { moreInfo } = anime;

    return (
        <div className="bg-card/50 border border-border/50 rounded-lg p-4 space-y-2.5">
            <InfoRow label="Japanese" value={moreInfo.japanese} />
            <InfoRow label="Synonyms" value={moreInfo.synonyms} />
            <InfoRow label="Aired" value={moreInfo.aired} />
            <InfoRow label="Premiered" value={moreInfo.premiered} />
            <InfoRow label="Status" value={moreInfo.status} />
            <InfoRow label="MAL Score" value={String(moreInfo.malscore)} />
            <InfoRow label="Genres" value={moreInfo.genres} isLink linkPrefix="/genre/" />
            <InfoRow label="Studios" value={moreInfo.studios} />
            <InfoRow label="Producers" value={moreInfo.producers} />
        </div>
    );
}
