import { mediaItems } from "@/lib/data";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/watch/video-player";
import EpisodeList from "@/components/watch/episode-list";
import Comments from "@/components/watch/comments";
import { Badge } from "@/components/ui/badge";
import MediaCard from "@/components/media/media-card";

export function generateStaticParams() {
  return mediaItems.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const media = mediaItems.find((item) => item.id === params.id);
  if (!media) {
    return { title: "Not Found" };
  }
  return {
    title: `Watch ${media.title} - ProjectX`,
    description: media.description,
  };
}

export default function WatchPage({ params }: { params: { id: string } }) {
  const media = mediaItems.find((item) => item.id === params.id);

  if (!media) {
    notFound();
  }

  const relatedMedia = mediaItems
    .filter((item) => item.id !== media.id && item.genres.some(g => media.genres.includes(g)))
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer media={media} />
          <div className="mt-6">
            <h1 className="text-3xl font-bold font-headline">{media.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
                {media.genres.map(genre => <Badge key={genre} variant="secondary">{genre}</Badge>)}
            </div>
            <p className="mt-4 text-muted-foreground">{media.description}</p>
          </div>
          <div className="mt-8">
            <Comments />
          </div>
        </div>
        <div className="lg:col-span-1">
          <EpisodeList />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedMedia.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
