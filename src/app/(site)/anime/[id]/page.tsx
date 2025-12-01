
import AnimeDetailsClient from '@/components/anime/AnimeDetailsClient';

export default function AnimeDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full flex-1 pb-10">
        <AnimeDetailsClient id={params.id} />
    </div>
  )
}
