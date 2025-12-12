# Project X - Operations Command

This file tracks the strategic objectives and operational tasks for the Project X application using a Kanban-style board.

Current Date: December 13, 2025  
Empire Status: Scaling to dominate anime streaming

---

### Mission Board

| Backlog | In Progress | Completed |
| --- | --- | --- |
| **Core Systems Foundation** | | |
| `[ ]` **Integrate Firebase completely**<br>• Create `src/lib/firebase.ts` with client SDK initialization using provided config<br>• Set up Firebase Auth with Google provider and Email/Password<br>• Initialize Firestore with collections: `users`, `anime`, `comments`, `watchlist`, `notifications`, `reports`<br>• Add Firebase Storage for user avatars and custom themes<br>• Implement Firebase Analytics with custom events<br>• Create `FirebaseProvider.tsx` to wrap the entire app in `src/app/providers.tsx`<br>• Add error handling and offline detection | `[ ]` **Upgrade User Panel to support Moderator role**<br>• Add `role` field to user document with values: `user`, `moderator`, `admin`<br>• Implement role-based conditional rendering using `useUserPanel` hook<br>• Create moderator-specific tools: delete/hide comments, warn users, pin threads, access report queue<br>• Add moderator badge on profile and comments | |
| `[ ]` **Build full Admin Panel (48 tabs)**<br>• Design responsive sidebar with collapsible mobile menu and 48 tab navigation<br>• Implement permission guard using role + granular permissions<br>• Build each tab with real-time Firestore data, full CRUD operations, search/filter, pagination<br>• Add audit logging collection for every admin action (who, what, when, IP)<br>• Implement bulk actions and export to CSV where applicable | | |
| `[ ]` **Create dedicated Moderator Panel**<br>• Create separate route `/mod` with lighter sidebar (only relevant tabs)<br>• Include real-time report queue, comment moderation, user warning system<br>• Add quick actions: hide comment, lock thread, temporary mute user<br>• Show notification count for pending reports | | |
| | | |
| **Community & Discussion Empire** | | |
| `[ ]` **Upgrade Comments to full threaded discussions**<br>• Implement nested replies with depth limit of 5 levels<br>• Add reply quoting, @mentions with autocomplete, spoiler tags with blur<br>• Use Firestore recursive listeners for real-time updates<br>• Implement upvote/downvote with score-based sorting (hot, new, top) | `[ ]` **Add rich text editor for comments**<br>• Integrate TipTap editor with toolbar (bold, italic, link, image, code)<br>• Support auto-save drafts to localStorage<br>• Add mobile-friendly keyboard handling | |
| `[ ]` **Implement comment reporting & moderation queue**<br>• Add report button with predefined reasons (spam, harassment, spoiler, off-topic)<br>• Create `/reports` collection with status (pending, resolved, dismissed)<br>• Build moderator queue with filters and one-click actions (delete, warn user, dismiss)<br>• Send notification to reporter on resolution | | |
| `[ ]` **Build full Discussion Board**<br>• Create categories collection with order, icon, color<br>• Implement thread creation with title, rich text body, category selection, poll option<br>• Add thread features: pin to top, lock replies, feature on homepage<br>• Implement user karma system based on upvotes and helpful comments<br>• Add full-text search and sorting options (hot, new, top, controversial) | | |
| `[ ]` **Implement Anime Stickers / Reaction system**<br>• Curate 50+ custom anime reaction stickers (Luffy gear5, Gojo domain, etc.)<br>• Add reaction picker to comments, episodes, and discussion posts<br>• Show reaction counts and top reactors list<br>• Allow users to favorite reactions for quick access | | |
| | | |
| **Watchlist & External Sync** | | |
| `[ ]` **Implement full Watchlist system**<br>• Create watchlist collection per user with status (Watching, Completed, Paused, Dropped, Planning)<br>• Add episode progress tracking with percentage bar<br>• Allow personal notes and custom rating (1-10)<br>• Implement private/public toggle and shareable link generation | `[ ]` **Add watchlist sharing and public lists**<br>• Generate public watchlist URL with customizable view<br>• Allow following other users' public lists<br>• Show "X users have this on their watchlist" on anime page | |
| `[ ]` **Integrate MyAnimeList (MAL) sync**<br>• Set up MAL OAuth2 with your client ID/secret<br>• Implement import of entire list including scores, progress, start/end dates<br>• Build export functionality to update MAL on progress change<br>• Add daily auto-sync toggle with conflict resolution modal<br>• Handle edge cases (dropped → completed, score changes) | `[ ]` **Integrate AniList sync**<br>• Set up AniList OAuth2 connection<br>• Import full list including custom lists, advanced scores, rewatches, notes<br>• Implement real-time webhook for instant sync (if user updates on AniList)<br>• Add support for AniList-specific fields (media list options, priority)<br>• Build conflict resolution with side-by-side comparison | |
| `[ ]` **Implement cross-device progress tracking**<br>• Save last watched timestamp and position in episode<br>• Continue watching carousel on homepage across devices<br>• Sync offline actions when connection restored<br>• Add "Continue watching on another device" prompt | `[ ]` **Add watch history with calendar heatmap**<br>• Build interactive calendar heatmap showing daily watching activity<br>• Display stats: "You watched 487 hours this year", longest streak, favorite day<br>• Allow monthly/weekly view toggle | |
| | | |
| **Outstanding User Features** | | |
| `[ ]` **Build Achievements system**<br>• Design 300+ badges with rarity tiers (common, rare, epic, legendary, secret)<br>• Implement unlock conditions (watch 100 episodes, complete 50 series, etc.)<br>• Add animated unlock notifications and progress bars<br>• Create badge showcase section on profile with sharing options | | |
| `[ ]` **Implement AI Curator**<br>• Integrate voice input using Web Speech API<br>• Accept text prompts for mood-based recommendations<br>• Generate playlists with reasoning ("Because you watched X")<br>• Allow saving and sharing curated playlists | | |
| `[ ]` **Create Watch Parties**<br>• Implement room creation with unique shareable link<br>• Synchronize video playback across users<br>• Add voice chat (WebRTC) and text chat with timestamps<br>• Include reaction emojis and host controls (pause for all, kick user) | | |
| `[ ]` **Add Custom Lists**<br>• Allow unlimited custom lists per user (e.g., "Mind-Bending", "Comfort Shows")<br>• Support public/private and collaborative editing<br>• Add voting/ranking system within lists<br>• Show list stats and follower count | | |
| `[ ]` **Implement Offline Downloads**<br>• Allow downloading episodes for offline viewing<br>• Build download manager with queue, progress, and storage usage<br>• Add auto-delete after watching option<br>• Sync download status across devices | | |
| `[ ]` **Build real-time Notification Center**<br>• Send notifications for new episodes, comment replies, mentions, friend requests<br>• Implement web push notifications + mobile support<br>• Add notification settings with toggle groups<br>• Mark as read functionality with unread count badge | | |
| `[ ]` **Develop Theme Studio**<br>• Create theme editor with color pickers, font selection, background upload<br>• Allow saving multiple themes and one-click switching<br>• Implement community theme sharing with preview and download<br>• Add theme marketplace with search and ratings | | |
| `[ ]` **Implement Friends system**<br>• Add friend requests with accept/decline<br>• Show online status and current watching activity<br>• Build activity feed ("Alex started One Piece")<br>• Enable watch together invites and shared watch parties | | |
| `[ ]` **Add Calendar**<br>• Display airing schedule with countdown timers to next episode<br>• Allow setting personal reminders and push notifications<br>• Filter calendar by user's watchlist<br>• Highlight new episodes and season premieres | | |
| `[ ]` **Implement advanced Review system**<br>• Rich text reviews with formatting and spoiler tags<br>• Implement helpful/unhelpful voting system<br>• Sort reviews by helpfulness, date, rating<br>• Add review moderation for reported content | | |
| | | |
| **Mobile & Performance Dominance** | | |
| `[ ]` **Achieve iOS-like mobile experience**<br>• Implement fixed bottom navigation with badges and haptic feedback<br>• Add swipe gestures (back navigation, double-tap skip 10s)<br>• Implement pull-to-refresh with custom anime spinner<br>• Optimize touch targets and keyboard handling | | |
| `[ ]` **Implement Progressive Web App (PWA)**<br>• Create manifest.json with icons and splash screens<br>• Add install prompt with custom messaging<br>• Implement service worker for offline caching<br>• Ensure full offline functionality for watchlist and downloads | | |
| `[ ]` **Add progressive image loading**<br>• Implement blur placeholder transitioning to sharp image<br>• Add multiple fallback URLs for broken images<br>• Use low-quality image placeholders (LQIP) | | |
| `[ ]` **Optimize search**<br>• Implement real-time search suggestions with anime posters<br>• Add voice search using Web Speech API<br>• Include filters in search results (genre, year, type) | | |
| | | |
| **Monetization & Sustainability** | | |
| `[ ]` **Add crypto donation system**<br>• Integrate Monero (XMR) and Bitcoin (BTC) wallets<br>• Add prominent "Support Project X" button in footer and sidebar<br>• Create optional donor leaderboard with custom badges | | |
| `[ ]` **Integrate merch store**<br>• Partner with print-on-demand service (Printful/Teespring)<br>• Design anime meme merchandise (hoodies, stickers, mousepads)<br>• Add merch link in footer and user profile | | |
| `[ ]` **Add affiliate links**<br>• Partner with legal anime stores (Crunchyroll, RightStuf) and VPN providers<br>• Add affiliate disclosure and tracking<br>• Place links in footer and relevant pages | | |

**Project X = WATCH ANIMES, READ MANGAS, COMMENT — FOREVER**  
Commander, execute these actionable tasks → build the ultimate anime streaming empire.  
**Forever.**