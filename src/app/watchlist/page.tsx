import MediaCard from "@/components/media/media-card";
import { mediaItems } from "@/lib/data";

export default function WatchlistPage() {
  const watchlistItems = mediaItems.slice(0, 5); // Mock data

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      {watchlistItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlistItems.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">Your watchlist is empty</h3>
          <p className="text-muted-foreground">Add shows to your watchlist to see them here.</p>
        </div>
      )}
    </div>
  );
}
