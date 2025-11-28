'use client';

import Link from 'next/link';
import { Twitter, Send } from 'lucide-react';
import AZList from "@/components/layout/az-list-footer";

export default function Footer() {
    return (
        <footer className="bg-[#100f14] text-gray-400 mt-12 border-t border-border/40">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-center mb-2 text-muted-foreground">
                A-Z List <span className="font-normal">Searching anime order by alphabet name A to Z.</span>
                </h3>
                <AZList />
            </div>

            <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <p className="text-xs max-w-2xl mb-2">
                    ProjectX does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                </p>
                <p className="text-xs">© ProjectX. All rights reserved.</p>
                </div>
                <div className="flex items-center justify-start md:justify-end gap-3">
                <Link href="/request" className="text-sm hover:text-primary">Request</Link>
                <Link href="/contact" className="text-sm hover:text-primary">Contact us</Link>
                <div className="flex items-center gap-2">
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-full hover:bg-primary transition-colors"><Send className="w-4 h-4" /></a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-full hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                </div>
                </div>
            </div>

            </div>
        </footer>
    )
}
