
'use client';

import { CharacterVoiceActor } from "@/types/anime";
import Image from "next/image";

interface CharactersGridProps {
    characters: CharacterVoiceActor[];
}

export default function CharactersGrid({ characters }: CharactersGridProps) {
    if (!characters || characters.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display">Characters & Voice Actors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.slice(0, 10).map(({ character, voiceActor }) => (
                    <div key={character.id} className="flex bg-card/50 rounded-lg overflow-hidden border border-border/50">
                        {/* Character */}
                        <div className="flex-1 flex items-center gap-3 p-2">
                             <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={character.poster} alt={character.name} fill className="object-cover" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate">{character.name}</p>
                                <p className="text-xs text-muted-foreground">{character.cast}</p>
                            </div>
                        </div>

                        {/* Voice Actor */}
                         <div className="flex-1 flex items-center gap-3 p-2 text-right justify-end">
                             <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate">{voiceActor.name}</p>
                                <p className="text-xs text-muted-foreground">{voiceActor.cast}</p>
                            </div>
                             <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={voiceActor.poster} alt={voiceActor.name} fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
