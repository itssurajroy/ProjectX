
import Link from "next/link";
import AZList from "./az-list-footer";
import { Twitter, Send, MessageSquare, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#100f14] text-gray-400 mt-12 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
            <AZList />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-gray-800 pt-8">
             <div>
                 <p className="text-xs max-w-lg mb-4">
                    ProjectX is a free anime streaming website with no ads, providing a safe and high-quality experience. This site does not store any files on its server; all contents are provided by non-affiliated third parties.
                </p>
                 <p className="text-xs">&copy; ProjectX. All rights reserved.</p>
             </div>
             <div className="flex flex-col items-start md:items-end">
                <div className="flex items-center gap-3 mb-3">
                  <a href="/community" className="w-9 h-9 flex items-center justify-center bg-gray-700/60 rounded-full hover:bg-primary transition-colors" title="Community">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-700/60 rounded-full hover:bg-primary transition-colors" title="Discord">
                    <Send className="w-4 h-4 text-white" />
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-700/60 rounded-full hover:bg-primary transition-colors" title="Twitter">
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <Link href="/terms" className="hover:text-primary">Terms</Link>
                    <Link href="/dmca" className="hover:text-primary">DMCA</Link>
                    <Link href="/contact" className="hover:text-primary">Contact</Link>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
