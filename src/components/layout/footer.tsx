'use client';
import Link from "next/link";
import AZList from "@/components/layout/az-list-footer";
import { Send, Twitter } from "lucide-react";


export default function Footer() {
    return (
        <footer className="bg-[#100f14] text-gray-400 mt-12 border-t border-border/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                  <AZList />
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-gray-800 pt-8 mt-8">
                <div>
                   <Link href="/" className="text-2xl font-bold text-glow font-display">
                        <span className="text-primary">Project</span><span className="text-white">X</span>
                    </Link>
                   <p className="text-xs max-w-md mt-4">
                     ProjectX does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                   </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="flex items-center gap-3">
                      <Link href="/request" className="text-sm hover:text-primary">Request</Link>
                      <Link href="/contact" className="text-sm hover:text-primary">Contact Us</Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-card/50 rounded-full hover:bg-primary transition-colors"><Send className="w-4 h-4" /></a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-card/50 rounded-full hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                    </div>
                    <p className="text-xs">© ProjectX. All rights reserved.</p>
                </div>
              </div>

            </div>
          </footer>
    )
}
