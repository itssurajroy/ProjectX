'use client';

import { AnimeBase, UserHistory } from "@/lib/types/anime";
import HistoryItem from "./HistoryItem";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const HistoryGroup = ({ title, items, animeDetails }: { title: string, items: UserHistory[], animeDetails: Map<string, AnimeBase> | undefined }) => (
    <AccordionItem value={title} className="bg-card/50 border border-border/50 rounded-lg px-4">
        <AccordionTrigger className="text-xl font-bold font-display hover:no-underline">
            {title}
        </AccordionTrigger>
        <AccordionContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-4">
                {items.map(item => {
                    const anime = animeDetails?.get(item.animeId);
                    return anime ? <HistoryItem key={item.id} item={item} anime={anime} /> : null
                })}
            </div>
        </AccordionContent>
    </AccordionItem>
);

export default HistoryGroup;
