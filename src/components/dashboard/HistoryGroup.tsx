
'use client';

import { AnimeBase, UserHistory } from "@/lib/types/anime";
import HistoryItem from "./HistoryItem";

const HistoryGroup = ({ title, items, animeDetails }: { title: string, items: UserHistory[], animeDetails: Map<string, AnimeBase> | undefined }) => (
    <div>
        <h2 className="font-bold text-lg mb-3">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => <HistoryItem key={item.id} item={item} anime={animeDetails?.get(item.animeId)} />)}
        </div>
    </div>
);

export default HistoryGroup;
