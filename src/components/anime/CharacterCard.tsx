
'use client';

import { CharacterVoiceActor } from "@/lib/types/anime";
import Link from "next/link";
import ProgressiveImage from "../ProgressiveImage";

export default function CharacterCard({ cv }: { cv: CharacterVoiceActor }) {
    return (
        <div className="bg-card rounded-lg flex items-center justify-between p-2 border border-transparent hover:border-primary/50 transition-colors duration-300">
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
