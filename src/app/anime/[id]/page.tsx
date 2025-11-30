
import AnimeDetailsClient from '@/components/anime/AnimeDetailsClient';

export default function AnimeDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <AnimeDetailsClient id={id} />;
}
