import MediaCard from "@/components/media/media-card";
import { mediaItems } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const historyItems = mediaItems.slice(5, 10); // Mock data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My History</h1>
        <Button variant="destructive">Clear History</Button>
      </div>

      {historyItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {historyItems.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">You haven't watched anything yet</h3>
          <p className="text-muted-foreground">Your viewing history will appear here.</p>
        </div>
      )}
    </div>
  );
}
