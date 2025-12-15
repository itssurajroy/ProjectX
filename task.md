# Project X: Status & Task List

This document outlines the current state of the Project X application, including completed features, areas needing improvement, and known issues.

---

### ✅ Completed Features

- **Core Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI.
- **Firebase Integration**:
    - Authentication (Email/Password, Google).
    - Firestore for user data (profiles, watchlist, history) and comments.
- **API Layer**:
    - Robust `AnimeService` for fetching data from the external API via a Next.js proxy.
    - MAL (MyAnimeList) service for supplementary data.
- **Key Pages & UI**:
    - **Homepage**: Dynamic spotlight, trending sections, latest episodes, and various discovery categories.
    - **Anime Details Page**: Comprehensive info, character/VA lists, related/recommended sections, and a mobile-optimized layout.
    - **Video Player Page**: Functional video player with episode list, server selection, and user controls.
    - **Search & Discovery**: Advanced search with filters (genre, type, status), A-Z list, dedicated pages for Movies and TV shows.
- **User Dashboard**:
    - **Watchlist**: Full CRUD functionality with status filtering and sorting.
    - **History**: Tracks watched episodes and progress.
    - **Profile**: View and edit user display name and avatar.
    - **Statistics & Achievements**: Dynamic stats based on watch history and a badge system.
- **AI Features (Genkit)**:
    - **AI Curator**: Provides personalized anime recommendations based on a user's watch history and a text prompt.
- **Community Features**:
    - **Commenting System**: Real-time, threaded comments with replies and spoiler tags on anime/episode pages.
    - **Watch Together (W2G)**: Lobby for creating and joining rooms, with a basic synchronized player and chat.
- **Mobile UI/UX**:
    - Responsive layouts for all major pages.
    - A dedicated mobile bottom navigation bar for core features.

---

### 🚀 Areas for Improvement

- **Player Controls & Features**:
    - Implement `Auto Skip Intro/Outro` functionality. The UI buttons exist but are not yet functional.
    - Enable true video casting (AirPlay/Chromecast) beyond the native browser implementation.
- **Watch Together (W2G) Synchronization**:
    - The current player state synchronization is basic. A more robust backend (e.g., WebSockets or a real-time database with lower latency) is needed for seamless sync of play/pause/seek actions.
    - Implement host transfer if the original host leaves the room.
- **UI/UX Polish**:
    - **Animations**: Add more fluid transitions and micro-interactions (e.g., Framer Motion for page transitions and list item animations).
    - **Haptic Feedback**: Integrate haptic feedback on mobile for key interactions (button presses, swipes).
    - **Tablet Optimization**: While responsive, layouts could be further optimized specifically for tablet screen sizes.
- **Backend & Database**:
    - **Notification System**: The UI is present, but the backend logic for creating and pushing notifications (e.g., new episodes, replies) is not implemented.
    - **Admin Panel**: The admin panel is a placeholder and needs to be connected to a functional backend to manage users, anime content, etc.
- **AI & Personalization**:
    - **Recommendation Engine**: Beyond the AI Curator, implement more passive recommendation carousels like "Because you watched X...".
    - **MAL/AniList Sync**: The full two-way synchronization of user watchlists is a major feature that has not been started.

---

### ⚠️ Known Issues & Bugs

- **API Rate Limiting/Failures**:
    - The external API can be unreliable, leading to `503 Service Unavailable` errors when it fails or changes its request patterns. The search endpoint was recently patched for this, but other endpoints may be vulnerable.
- **Friends System**:
    - The entire Friends feature is non-functional and exists only as a placeholder UI.
- **Episode Thumbnails**:
    - The app currently uses placeholder images (`picsum.photos`) for episode thumbnails. The API needs to be checked for actual thumbnail URLs to be implemented.
- **Watchlist Progress Tracking**:
    - The watchlist does not yet track the number of episodes watched for a series (e.g., "12/24 episodes"). This requires linking history data to the watchlist.
- **Casting Functionality**:
    - The "Cast" button is a placeholder. It relies on native browser casting of the `iframe` content, which may not always be available or reliable.
- **Mobile Search**:
    - The primary search input is in the bottom navigation, but a non-functional search bar may still appear in the header on some mobile views, which can be confusing.
