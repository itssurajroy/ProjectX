
import AnimeDetailsClient from '@/components/anime/AnimeDetailsClient';

export default function AnimeDetailsPage({ params }: { params: { id: string } }) {
  return <AnimeDetailsClient id={params.id} />;
}
