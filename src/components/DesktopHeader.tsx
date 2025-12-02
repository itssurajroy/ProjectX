
// src/components/DesktopHeader.tsx
import Link from "next/link";
import SearchBar from "./SearchBar";
import RandomAnimeButton from "./RandomAnimeButton";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

const SiteLogo = () => (
    <Link href="/home" className="flex items-center gap-2" title="ProjectX Home">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-2xl font-bold text-white">ProjectX</span>
    </Link>
)

export default function DesktopHeader() {
  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: Logo + Main Nav */}
          <div className="flex items-center gap-12">
            <SiteLogo />

            <nav className="flex items-center gap-8 text-lg font-medium">
              <Link href="/home" className="hover:text-primary transition">Home</Link>
              <Link href="/az-list/all" className="hover:text-primary transition">Browse</Link>
              <Link href="/search?type=dub" className="hover:text-primary transition">Dubbed</Link>
              <Link href="/movies" className="hover:text-primary transition">Movies</Link>
              <Link href="/search?sort=popularity" className="hover:text-primary transition">Popular</Link>
              <Link href="/search?status=Airing" className="hover:text-primary transition">Top Airing</Link>
              <Link href="/schedule" className="hover:text-primary transition">Schedule</Link>
              <Link href="/watch2gether" className="hover:text-primary transition">Watch Together</Link>
            </nav>
          </div>

          {/* Right: Tools */}
          <div className="flex items-center gap-6">
            <SearchBar />
            <RandomAnimeButton />   {/* Full glowing version */}
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
