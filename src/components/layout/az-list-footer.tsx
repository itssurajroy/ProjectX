
'use client';
import Link from "next/link";
import { cn } from "@/lib/utils";

const AZList = () => {
    const alphabet = ['All', '#', '0-9', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];

     const getCharPath = (char: string) => {
        if (char === 'All') return '/az-list/all';
        if (char === '#') return '/az-list/other';
        if (char === '0-9') return '/az-list/0-9';
        return `/az-list/${char.toLowerCase()}`;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-white">A-Z List</h2>
                    <p className="text-sm">Searching anime order by alphabet name A to Z.</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm">
                     <Link href="/request" className="hover:text-primary">Request</Link>
                     <Link href="/contact" className="hover:text-primary">Contact Us</Link>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
                {alphabet.map(char => {
                    const path = getCharPath(char);
                    return (
                        <Link 
                            key={char} 
                            href={path}
                            className={cn(
                                "w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-md transition-colors bg-card/50 hover:bg-muted"
                            )}
                        >
                            {char}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default AZList;
