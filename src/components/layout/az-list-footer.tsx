'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const AZList = () => {
    const alphabet = ['All', '#', '0-9', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];

    const getCharPath = (char: string) => {
        if (char === 'All') return 'all';
        if (char === '#') return 'other';
        return char.toLowerCase();
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">A-Z List</h2>
                <p className="text-sm text-muted-foreground">Searching anime order by alphabet name A to Z.</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
                {alphabet.map(char => {
                    const charPath = getCharPath(char);
                    return (
                        <Link 
                            key={char} 
                            href={`/az-list/${charPath}`} 
                            className={cn(
                                "w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-md transition-colors bg-card/50 hover:bg-primary hover:text-primary-foreground"
                            )}
                        >
                            {char}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default AZList;
