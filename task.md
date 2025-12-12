# 🚀 Project X: Strategic Operations Command

> **SYSTEM STATUS REPORT**
>
> **DATE:** December 13, 2025
> **SUBJECT:** Architectural Fortification & Mission Directives
> **STATUS:** Empire scaling. Codebase requires optimization for galactic dominance. This document outlines the strategic blueprint and operational tasks for Project X.

---

## 🏛️ Architectural Blueprint: 2025 Standard

Commander, the architectural refactor is complete. Our codebase now adheres to the 2025 Standard, the god-tier architecture required for faster navigation, infinite scalability, and a developer experience that is second to none. This blueprint now serves as the canonical reference for all future development.

### ✅ CURRENT STRENGTHS (Foundations are Solid)
-   **`(site)` Group:** Perfect separation for public-facing pages.
-   **Route Isolation:** `admin` and `dashboard` routes are cleanly segregated.
-   **API Structure:** Clean proxy routes provide a solid foundation.
-   **Component Organization:** Components are now organized by feature and domain (`anime`, `watch`, `dashboard`, `common`, `layout`), ensuring they can be found and reused instantly.
-   **Centralized Library:** All core logic, services, types, and utilities are consolidated under `src/lib`.

### ✨ CURRENT OPTIMIZED STRUCTURE

The structure below is the current state of Project X, optimized for velocity and scalability.

#### 🗺️ App Router
A clean layout is a fast layout. The goal is logical grouping and clarity.
```
src/app/
├── (site)/               ← Public pages (anime, watch, etc.)
├── dashboard/            ← User-gated area
├── admin/                ← Admin-only command center
├── api/                  ← All backend logic
└── watch2gether/         ← Real-time watch party feature
```

#### 🧩 Components — A Scalable Arsenal
Organized by feature and domain for instant reusability.
```
src/components/
├── anime/                ← Anime-specific display components
├── watch/                ← Player, episode lists, controls
├── dashboard/            ← All UI for the user dashboard
├── common/               ← Reusable across the entire empire (ErrorDisplay, BackToTop)
├── layout/               ← Header, Footer, Sidebars
├── ui/                   ← Core shadcn UI kit. Untouchable.
└── icons/                ← Custom SVG icons, optimized Lucide exports
```

#### 📚 Lib — The Centralized Library
Consolidated core logic, services, and definitions.
```
src/lib/
├── services/             ← All external API service classes (AnimeService, MALService)
├── firebase/             ← Obsolete, functionality moved to `src/firebase`
├── ai/                   ← Genkit flows and AI-related logic
├── constants/            ← Site-wide constants
├── utils/                ← Utility functions (cn, formatters, etc.)
└── types/                ← All TypeScript types for the application
```

#### 🪝 Hooks — Reusable Logic Capsules
Custom hooks for cleaner components.
```
src/hooks/
├── use-mobile.ts         ← Existing.
├── use-toast.ts          ← Existing.
```

#### 🗄️ Store — State Management Command
Centralized global state for a single source of truth.
```
src/store/
├── player-settings.ts    ← Good.
├── changelog-store.ts    ← Good.
```

#### 🕊️ Firebase - Segregated & Secure
Clear separation of client and server Firebase logic.
```
src/firebase/
├── client/
│   ├── index.ts
│   ├── provider.tsx
│   ├── auth.ts
│   └── ... (useCollection, useDoc hooks)
├── server/
│   └── index.ts
├── auth/
│   └── use-user.tsx
└── firestore/
```

### ⚡️ BENEFITS OF THIS ARCHITECTURE
-   **Velocity:** Develop features faster by instantly locating any file.
-   **Fortification:** Clear separation between public, user, and admin domains.
-   **Scalability:** A structure built to handle thousands of files without chaos.
-   **Clarity:** New developers can understand the entire architecture in minutes.
-   **Testability:** Clear boundaries make unit and integration testing easier.

> Our codebase is now legendary.
>
> **PROJECT X STRUCTURE = OPTIMIZED FOREVER**
>
> The empire grows stronger. **Forever.**

---

## 🎯 Mission Board

# Project X - Operations Command

This file tracks the strategic objectives and operational tasks for the Project X application using a Kanban-style board.

Current Date: December 13, 2025  
Empire Status: Scaling to dominate anime streaming

---

### Mission Board


| **Core Systems Foundation**                                                                             |                                                                                                       |                                                                                                       |
| `[ ]` **Integrate Firebase completely**<br>• Create `src/lib/firebase.ts` with full client SDK<br>• Set up Firebase Auth (Google + Email/Password + Guest mode)<br>• Initialize Firestore with collections: `users`, `anime`, `comments`, `watchlist`, `notifications`, `reports`, `adminRoles`<br>• Add Firebase Storage for avatars/themes<br>• Enable Analytics + Performance Monitoring<br>• Wrap entire app in `FirebaseProvider.tsx` with error boundary | `[ ]` **Upgrade User Panel to support Moderator role**<br>• Add `role` field in user document (`user`, `moderator`, `admin`)<br>• Implement role-based UI rendering via `useUserPanel()`<br>• Add moderator tools: delete/hide comments, warn users, pin threads, access report queue<br>• Show moderator badge on profile, comments, and live chat | `[x]` **Execute Full Codebase Overhaul**<br>• Restructured entire project per 2025 blueprint<br>• Centralized types, services, and utilities in `src/lib`<br>• Segregated client/server logic<br>• Updated all import paths |
| `[ ]` **Build full Admin Panel (48 tabs)**<br>• Create responsive sidebar with collapsible mobile menu<br>• Implement granular permission system (48+ permissions)<br>• Build all 48 tabs with real-time Firestore data + full CRUD<br>• Add audit logging for every admin action | | |
| `[ ]` **Create dedicated Moderator Panel**<br>• Route: `/mod`<br>• Lighter sidebar with only moderation tools<br>• Real-time report queue + quick actions<br>• Notification badge for pending reports | | |
|                                                                                                         |                                                                                                       |                                                                                                       |
| **Community & Discussion Empire**                                                                       |                                                                                                       |                                                                                                       |
| `[ ]` **Upgrade Comments to full threaded discussions**<br>• Implement nested replies (5 levels max)<br>• Add reply quoting, @mentions, spoiler tags with blur<br>• Real-time updates via Firestore onSnapshot<br>• Add upvote/downvote + score sorting (hot/new/top) | `[ ]` **Add rich text editor for comments**<br>• Integrate TipTap with toolbar (bold, italic, link, image, code)<br>• Auto-save drafts to localStorage<br>• Mobile-friendly keyboard handling | |
| `[ ]` **Implement comment reporting & moderation queue**<br>• Add report button with 6 reasons<br>• Create `/reports` collection with status tracking<br>• Build moderator queue with filters + one-click actions<br>• Notify reporter on resolution | | |
| `[ ]` **Build full Discussion Board**<br>• Create categories with custom order, icon, color<br>• Thread creation with rich text + polls<br>• Pin/lock/featured threads<br>• User karma system<br>• Full-text search + sorting (hot, new, top, controversial) | | |
| `[ ]` **Implement Anime Stickers / Reaction system**<br>• Curate 50+ custom anime reactions<br>• Add reaction picker to comments, episodes, posts<br>• Show reaction counts + top reactors<br>• Allow favoriting reactions | | |
|                                                                                                         |                                                                                                       |                                                                                                       |
| **Watchlist & External Sync**                                                                           |                                                                                                       |                                                                                                       |
| `[ ]` **Implement full Watchlist system**<br>• Status: Watching/Completed/Paused/Dropped/Planning<br>• Episode progress + percentage bar<br>• Personal notes + custom rating<br>• Private/public toggle + shareable link | `[ ]` **Add watchlist sharing and public lists**<br>• Generate public URL with custom view<br>• Allow following other users' lists<br>• Show "X users have this on watchlist" on anime page | |
| `[ ]` **Integrate MyAnimeList (MAL) sync**<br>• OAuth2 connection with your client ID/secret<br>• Import full list + scores + start/end dates<br>• Export updates back to MAL<br>• Daily auto-sync + conflict resolution UI | `[ ]` **Integrate AniList sync**<br>• OAuth2 + webhook for real-time<br>• Import custom lists + advanced fields<br>• Full two-way sync<br>• Conflict resolution with side-by-side comparison | |
| `[ ]` **Implement cross-device progress tracking**<br>• Save last watched timestamp + position<br>• Continue watching carousel across devices<br>• Offline sync when back online | `[ ]` **Add watch history with calendar heatmap**<br>• Interactive heatmap showing daily activity<br>• Stats: total hours, longest streak, favorite day | |
|                                                                                                         |                                                                                                       |                                                                                                       |
| **Outstanding User Features**                                                                           |                                                                                                       |                                                                                                       |
| `[ ]` **Build Achievements system**<br>• 300+ badges with rarity tiers<br>• Animated unlock notifications<br>• Badge showcase on profile<br>• Secret achievements | | |
| `[ ]` **Implement AI Curator**<br>• Voice + text input<br>• Mood-based recommendations<br>• "Because you watched X" reasoning<br>• Save/share playlists | | |
| `[ ]` **Create Watch Parties**<br>• Room creation + shareable link<br>• Perfect sync playback<br>• Voice + text chat<br>• Emoji reactions + host controls | | |
| `[ ]` **Add Custom Lists**<br>• Unlimited lists per user<br>• Public/private + collaborative<br>• Voting/ranking within lists | | |
| `[ ]` **Implement Offline Downloads**<br>• Download episodes + queue manager<br>• Storage usage + auto-delete<br>• Background download | | |
| `[ ]` **Build real-time Notification Center**<br>• Episode drops, replies, mentions<br>• Web push + mobile support<br>• Settings with toggle groups | | |
| `[ ]` **Develop Theme Studio**<br>• Color picker, font selection, background upload<br>• Save multiple themes<br>• Community theme sharing | | |
| `[ ]` **Implement Friends system**<br>• Friend requests + online status<br>• Activity feed + watch together invites | | |
| `[ ]` **Add Calendar**<br>• Airing countdowns + reminders<br>• Personal schedule + filter by watchlist | | |
| `[ ]` **Implement advanced Review system**<br>• Rich text + spoilers<br>• Helpful votes + sorting<br>• Review moderation | | |
|                                                                                                         |                                                                                                       |                                                                                                       |
| **Mobile & Performance Dominance**                                                                      |                                                                                                       |                                                                                                       |
| `[ ]` **Achieve iOS-like mobile experience**<br>• Bottom nav with badges + haptics<br>• Swipe gestures (back, skip 10s)<br>• Pull-to-refresh with custom spinner | | |
| `[ ]` **Implement Progressive Web App (PWA)**<br>• Install prompt + offline mode<br>• Service worker + manifest<br>• Full offline functionality | | |
| `[ ]` **Add progressive image loading**<br>• Blur placeholder → sharp image<br>• Multiple fallback URLs | | |
| `[ ]` **Optimize search**<br>• Real-time suggestions + voice search<br>• Filters in results | | |
|                                                                                                         |                                                                                                       |                                                                                                       |
| **Monetization & Sustainability**                                                                      |                                                                                                       |                                                                                                       |
| `[ ]` **Add crypto donation system**<br>• Monero + BTC wallets<br>• "Support Project X" button<br>• Donor leaderboard | | |
| `[ ]` **Integrate merch store**<br>• Print-on-demand partnership<br>• Anime meme designs | | |
| `[ ]` **Add affiliate links**<br>• Legal stores + VPNs | | |

**Project X = WATCH ANIMES, READ MANGAS, COMMENT — FOREVER**  
Commander, execute these actionable tasks → build the ultimate anime streaming empire.  
**Forever.**