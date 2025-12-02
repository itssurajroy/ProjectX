
// src/components/DesktopHeader.tsx
import Link from "next/link";
import SearchBar from "./SearchBar";
import RandomAnimeButton from "./RandomAnimeButton";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function DesktopHeader() {
  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: Logo + Main Nav */}
          <div className="flex items-center gap-12">
            <Link href="/" className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PROJECT X
            </Link>

            <nav className="flex items-center gap-8 text-lg font-medium">
              <Link href="/home" className="hover:text-cyan-400 transition">Home</Link>
              <Link href="/az-list/all" className="hover:text-cyan-400 transition">Browse</Link>
              <Link href="/search?type=dub" className="hover:text-cyan-400 transition">Dubbed</Link>
              <Link href="/movies" className="hover:text-cyan-400 transition">Movies</Link>
              <Link href="/search?sort=popularity" className="hover:text-cyan-400 transition">Popular</Link>
              <Link href="/search?status=Airing" className="hover:text-cyan-400 transition">Top Airing</Link>
              <Link href="/schedule" className="hover:text-cyan-400 transition">Schedule</Link>
              <Link href="/watch2gether" className="hover:text-cyan-400 transition">Watch Together</Link>
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
