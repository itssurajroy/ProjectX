# **App Name**: ProjectX

## Core Features:

- Zero-lag Custom Video Player: HLS.js core + MegaPlay.buzz iframe fallback → 100% uptime even if source dies
- Sub / Dub / Raw Instant Toggle: One-click switch without page reload (preloads next source)
- Skip Intro / Outro Buttons: Auto-detects timestamps from API or community reports
- Auto-Next Episode + Auto-Play: Seamless 3-second countdown, works across devices
- Continue Watching Sync: Firebase + IndexedDB → works offline and across phone/laptop
- Spotlight Hero Carousel: Full-screen auto-play with hover pause (exactly like HiAnime)
- Infinite Scroll Tabs: Trending · Top Airing · Recently Updated · Most Popular · Most Viewed
- Real-Time Comments: Firestore live updates, no polling, 100ms latency
- Advanced Search & Filters: Genre, year, season, type, status, studio, sort-by (popularity, rating, latest)
- Watchlist + History + Notifications: Fully synced, push notifications for new episodes
- Dark Neon Glassmorphism UI: Pixel-perfect clone of HiAnime 2025 design + smoother animations
- Offline Mode (PWA): Download episodes for offline watching (background HLS segments)
- Multi-Source Fallback Chain: Aniwatch-API → Consumet → Enime → MegaPlay → Direct MP4 → dead = next source auto-kicks in
- Admin Dashboard (/admin): User ban, episode moderation, analytics, force source update
- Lightning Fast & SEO Perfect: LCP < 1.4s, 100 Lighthouse mobile, full JSON-LD + OpenGraph + sitemap.xml
- Keyboard Shortcuts Everywhere: J/K (rewind/fast-forward), F (fullscreen), →/← (10s), Space (play/pause), M (mute)
- Mobile-First Perfection: Swipe gestures, bottom player bar, pull-to-refresh

## Style Guidelines:

- Primary color: Soft, modern blue (#64B5F6), evoking trust and reliability.
- Background color: Light gray (#F5F5F5), offering a clean and spacious feel.
- Accent color: Energetic orange (#FFB74D), highlighting key actions.
- Body and headline font: 'Inter', a sans-serif typeface offering a clean and neutral aesthetic.
- Use a set of minimalist icons with rounded corners to match the modern design aesthetic.
- Implement a grid-based layout system to ensure responsiveness and visual consistency across different screen sizes.
- Incorporate subtle transition animations to provide feedback and enhance user experience without overwhelming the interface.