
import { AnimeBase } from "@/lib/types/anime"
import Link from "next/link"
import { AnimeTooltip } from "./AnimeTooltip"
import { Clapperboard, Mic, Play, Clock, BookmarkPlus, MoreHorizontal, Check } from "lucide-react"
import ProgressiveImage from "./ProgressiveImage"
import { useUser, useDoc, useFirestore, setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase"
import { WatchlistItem, WatchlistStatus } from "@/lib/types/watchlist"
import toast from "react-hot-toast"
import { doc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useTitleLanguageStore } from "@/store/title-language-store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Skeleton } from "./ui/skeleton"

type AnimeCardProps = {
  anime: AnimeBase;
  rank?: number;
  variant?: "portrait" | "landscape";
}

const WatchlistButton = ({ animeId }: { animeId: string }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const docPath = user ? `users/${user.uid}/watchlist/${animeId}` : null;
  const { data: watchlistItem, isLoading: loadingWatchlist } = useDoc<WatchlistItem>(docPath);
  
  const isInWatchlist = !!watchlistItem;

  const statuses: WatchlistStatus[] = ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'];

  const handleWatchlistAction = (e: React.MouseEvent, action: 'add' | 'remove' | 'update', status?: WatchlistStatus) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!user) {
        toast.error("Log in to manage your watchlist.");
        router.push('/login');
        return;
    }
    
    const docRef = doc(firestore, `users/${user.uid}/watchlist/${animeId}`);
    let toastId;

    try {
        if (action === 'add') {
            toastId = toast.loading("Adding to watchlist...");
            setDocumentNonBlocking(docRef, {
                id: animeId,
                status: 'Plan to Watch',
                addedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }, { merge: false });
            toast.success("Added to watchlist!", { id: toastId });
        } else if (action === 'remove') {
            toastId = toast.loading("Removing from watchlist...");
            deleteDocumentNonBlocking(docRef);
            toast.success("Removed from watchlist.", { id: toastId });
        } else if (action === 'update' && status) {
            toastId = toast.loading(`Updating status to "${status}"...`);
            updateDocumentNonBlocking(docRef, {
                status: status,
                updatedAt: serverTimestamp(),
            });
            toast.success(`Status updated to "${status}"!`, { id: toastId });
        }
    } catch (err) {
        toast.error("Failed to update watchlist.", { id: toastId });
        console.error(err);
    }
  };

  if (isInWatchlist) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="absolute top-2 right-2 z-20 p-1.5 bg-primary rounded-full text-primary-foreground hover:bg-primary/80 transition-all duration-200"
                aria-label="Manage watchlist item"
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            {statuses.map((status) => (
                <DropdownMenuItem key={status} onSelect={(e) => handleWatchlistAction(e as any, 'update', status)}>
                    <Check className={cn("w-4 h-4 mr-2", watchlistItem?.status === status ? "opacity-100" : "opacity-0")} />
                    {status}
                </DropdownMenuItem>
            ))}
            <DropdownMenuItem onSelect={(e) => handleWatchlistAction(e as any, 'remove')} className="text-destructive">
                 Remove from list
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button
      onClick={(e) => handleWatchlistAction(e, 'add')}
      className="absolute top-2 right-2 z-20 p-1.5 bg-black/50 rounded-full text-white hover:bg-primary hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
      aria-label="Add to watchlist"
      disabled={loadingWatchlist}
    >
      <BookmarkPlus className="w-4 h-4" />
    </button>
  );
};


export function AnimeCard({ anime, rank }: AnimeCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { language } = useTitleLanguageStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-2">
        <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        <div className="mt-2 px-1 space-y-1">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    );
  }
  
  const isAdult = anime.rating === 'R' || anime.rating === 'R+' || anime.rating === 'Rx';
  
  const title = language === 'romaji' && anime.jname ? anime.jname : anime.name;

  return (
    <AnimeTooltip animeId={anime.id}>
      <Link href={`/anime/${anime.id}`} className="group relative block w-full h-full">
        
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-card shadow-md transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)_/_0.3)] group-hover:-translate-y-1 border-2 border-transparent group-hover:border-primary/50">
          
          <WatchlistButton animeId={anime.id} />

          {rank && (
            <div className="absolute top-0 left-0 z-20 bg-gradient-to-br from-primary to-accent px-3 py-1 rounded-br-lg text-white font-black text-lg shadow-lg">
              {rank < 10 ? `0${rank}` : rank}
            </div>
          )}

          <ProgressiveImage
            src={anime.poster}
            alt={anime.name || "Anime Poster"}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16.6vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-90" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <Play className="w-6 h-6 text-white fill-white" />
             </div>
          </div>

          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
             {isAdult && (
                <span className="bg-destructive/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-destructive/50 shadow-sm">
                   18+
                </span>
             )}
          </div>
        </div>

        <div className="mt-2 px-1 space-y-1">
          <h3 className="font-bold text-sm leading-tight text-foreground truncate group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-gray-400 transition-colors">
              {anime.type && (
                  <span className="capitalize">{anime.type}</span>
              )}
              
              {anime.duration && (
                  <>
                      <span className="w-0.5 h-0.5 bg-gray-600 rounded-full" />
                      <span className="flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {anime.duration}
                      </span>
                  </>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {anime.episodes?.sub && (
                  <div className="flex items-center gap-1 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Clapperboard className="w-3 h-3" />
                    {anime.episodes.sub}
                  </div>
              )}
              
              {anime.episodes?.dub && (
                  <div className="flex items-center gap-1 bg-green-600/20 border border-green-400/30 text-green-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <Mic className="w-3 h-3" />
                    {anime.episodes.dub}
                  </div>
              )}
              
              {!anime.episodes?.sub && !anime.episodes?.dub && anime.totalEpisodes && (
                  <div className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded border border-border">
                    Ep {anime.totalEpisodes}
                  </div>
              )}
            </div>
          </div>
        </div>

      </Link>
    </AnimeTooltip>
  )
}
