'use client';
import Link from 'next/link';

export default function AZList() {
    const alphabet = ['All', '#', '0-9', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

    const getCharPath = (char: string) => {
        if (char === 'All') return 'all';
        if (char === '#') return 'other';
        return char.toLowerCase();
    }

    return (
        <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">A-Z List</h3>
                <p className="text-xs text-muted-foreground">Searching anime order by alphabet name A to Z.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {alphabet.map(char => {
                    const charPath = getCharPath(char);
                    return (
                        <Link 
                            key={char} 
                            href={`/az-list/${charPath}`}
                            className="flex-grow text-center px-2 py-2 text-sm font-semibold rounded-md transition-colors bg-muted/40 hover:bg-muted"
                        >
                            {char}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
