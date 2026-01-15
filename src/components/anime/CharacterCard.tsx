
'use client';

import { CharacterVoiceActor } from "@/lib/types/anime";
import Link from "next/link";
import ProgressiveImage from "../ProgressiveImage";

export default function CharacterCard({ cv }: { cv: CharacterVoiceActor }) {
    return (
        <div className="bg-card/50 rounded-lg overflow-hidden flex border border-border/50 hover:border-primary/50 transition-colors duration-300">
            {/* Character */}
            <Link href={`/character/${cv.character.id}`} className="w-1/2 flex items-center gap-3 p-3 hover:bg-muted/30">
                <div className="relative aspect-[2/3] w-12 flex-shrink-0">
                    <ProgressiveImage 
                      src={cv.character.poster}
                      alt={cv.character.name || "Character"} 
                      fill
                      className="object-cover rounded-md"
                    />
                </div>
                <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-primary truncate">{cv.character.name}</h4>
                    <p className="text-xs text-muted-foreground">{cv.character.cast}</p>
                </div>
            </Link>
    
            {/* Voice Actor */}
            {cv.voiceActor && (
                <Link href={`/staff/${cv.voiceActor.id}`} className="w-1/2 flex items-center gap-3 p-3 bg-muted/20 justify-end text-right hover:bg-muted/50">
                    <div className="overflow-hidden">
                        <p className="font-bold text-sm truncate">{cv.voiceActor.name}</p>
                        <p className="text-xs text-muted-foreground">{cv.voiceActor.cast}</p>
                    </div>
                    <div className="relative aspect-square w-12 flex-shrink-0">
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
