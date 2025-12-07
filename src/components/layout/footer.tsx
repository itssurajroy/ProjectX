
'use client';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { Twitter, Send, Rss } from 'lucide-react';
import AZList from './az-list-footer';
import SiteLogo from './SiteLogo';
import { useChangelogStore } from '@/store/changelog-store';

const socialLinks = [
    { name: 'Discord', href: 'https://discord.gg/nHwCpPx9yy', icon: <Send className="w-5 h-5" />, color: 'bg-blue-600' },
    { name: 'Telegram', href: '#', icon: <Send className="w-5 h-5" />, color: 'bg-sky-500' },
    { name: 'Reddit', href: '#', icon: <Rss className="w-5 h-5" />, color: 'bg-orange-600' },
    { name: 'Twitter', href: 'https://x.com', icon: <Twitter className="w-5 h-5" />, color: 'bg-sky-400' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { openChangelog } = useChangelogStore();

  return (
    <footer className="bg-card text-muted-foreground mt-12 border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-border pb-8 mb-8">
            <SiteLogo />
            <div className="flex items-center justify-center gap-3">
                <p className="text-sm mr-4 hidden sm:block">Join now 👇</p>
                {socialLinks.map(link => (
                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${link.color} hover:scale-110 transition-transform`} aria-label={link.name}>
                        {link.icon}
                    </a>
                ))}
            </div>
        </div>
        
        <div className="mb-8">
          <AZList />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm mb-8 text-center">
            <Link href="/rules" className="hover:text-primary transition-colors">Rules</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/dmca" className="hover:text-primary transition-colors">DMCA</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <button onClick={openChangelog} className="hover:text-primary transition-colors">What's New</button>
        </div>

        <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
                {SITE_NAME} is a free anime streaming website with no ads, providing a safe and high-quality experience. This site does not store any files on its server; all contents are provided by non-affiliated third parties.
            </p>
            <p>
                © {currentYear} {SITE_NAME}. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
