
import AnimeDetailsClient from "@/components/anime/AnimeDetailsClient";

export default function AnimeDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // The Server Component simply extracts the ID and passes it to the Client Component.
  // All data fetching and logic are now handled within AnimeDetailsClient.
  return <AnimeDetailsClient id={id} />;
}
