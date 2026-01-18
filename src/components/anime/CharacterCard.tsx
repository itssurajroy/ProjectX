
'use client';

import { CharacterVoiceActor } from "@/lib/types/anime";
import Link from "next/link";
import ProgressiveImage from "../ProgressiveImage";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useUser, useFirestore, useDoc, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import toast from "react-hot-toast";
import { doc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CharacterCard({ cv }: { cv: CharacterVoiceActor }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const charId = cv.character.id;
    // This is a new subcollection, `favoriteCharacters`
    const docPath = user ? `users/${user.uid}/favoriteCharacters/${charId}` : null;
    const { data: favoriteDoc, loading: loadingFavorite } = useDoc<any>(docPath);
    const isFavorited = !!favoriteDoc;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("You must be logged in to favorite characters.");
            router.push('/login');
            return;
        }

        const docRef = doc(firestore, `users/${user.uid}/favoriteCharacters`, charId);

        if (isFavorited) {
            deleteDocumentNonBlocking(docRef);
            toast.success(`${cv.character.name} removed from favorites.`);
        } else {
            // Store some data about the character for future use (e.g., a "My Favorites" page)
            setDocumentNonBlocking(docRef, {
                characterName: cv.character.name,
                characterPoster: cv.character.poster,
                addedAt: serverTimestamp(),
            }, { merge: false });
            toast.success(`${cv.character.name} added to favorites!`);
        }
    };
    
    return (
        <div className="bg-card rounded-lg flex items-center justify-between p-2 border border-transparent hover:border-primary/50 transition-colors duration-300 relative group">
            
            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className="absolute top-1 right-1 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/60 rounded-full"
                disabled={loadingFavorite}
                aria-label="Favorite character"
            >
                <Heart className={cn("w-4 h-4 text-white transition-colors", isFavorited ? "fill-red-500 text-red-500" : "hover:fill-red-500/50")} />
            </Button>

            {/* Character */}
            <Link href={`/character/${cv.character.id}`} className="flex items-center gap-3 basis-1/2">
                <div className="relative w-10 h-10 flex-shrink-0">
                    <ProgressiveImage 
                      src={cv.character.poster}
                      alt={cv.character.name || "Character"} 
                      fill
                      className="object-cover rounded-full"
                    />
                </div>
                <div className="overflow-hidden">
                    <h4 className="font-semibold text-sm text-foreground truncate">{cv.character.name}</h4>
                    <p className="text-xs text-muted-foreground">{cv.character.cast}</p>
                </div>
            </Link>
    
            {/* Voice Actor */}
            {cv.voiceActor && (
                <Link href={`/staff/${cv.voiceActor.id}`} className="flex items-center gap-3 basis-1/2 justify-end text-right">
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm text-foreground truncate">{cv.voiceActor.name}</p>
                        <p className="text-xs text-muted-foreground">{cv.voiceActor.cast}</p>
                    </div>
                     <div className="relative w-10 h-10 flex-shrink-0">
                        <ProgressiveImage 
                          src={cv.voiceActor.poster}
                          alt={cv.voiceActor.name || "Voice Actor"} 
                          fill 
                          className="rounded-full object-cover"
                        />
                    </div>
                </Link>
            )}
        </div>
    );
};
