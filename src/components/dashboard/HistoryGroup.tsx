'use client';

import { AnimeBase, UserHistory } from "@/lib/types/anime";
import HistoryItem from "./HistoryItem";

const HistoryGroup = ({ title, items, animeDetails }: { title: string, items: UserHistory[], animeDetails: Map<string, AnimeBase> | undefined }) => (
    <section>
        <h2 className="font-bold text-xl font-display mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map(item => {
                const anime = animeDetails?.get(item.animeId);
                return anime ? <HistoryItem key={item.id} item={item} anime={anime} /> : null
            })}
        </div>
    </section>
);

export default HistoryGroup;
