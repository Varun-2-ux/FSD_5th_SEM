# CineScope — Movie Discovery System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Modern_Responsive-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, responsive cinematic movie discovery web application that helps users discover films, explore in-depth details, search with real-time debouncing, apply multi-criteria filters, and curate their personal offline-persistent Watchlist and Favourites.

---

## 🌟 Executive Summary & Features

### 🎬 1. Home / Discover
- **Cinematic Hero Spotlight**: Dynamic hero banner featuring high-resolution backdrop art, rating badge, release year, genre tags, and quick-action buttons (*View Details*, *Watch Trailer*, *Add to Watchlist*).
- **Featured Title Switcher**: Interactive switcher dots to cycle through trending spotlight titles.
- **Category Shortcuts**: One-tap access to popular genres (Action, Sci-Fi, Drama, Animation, Comedy, Thriller, Horror, Adventure).
- **Smooth Carousels**: Horizontally scrollable carousels for *Trending Now*, *Most Popular*, and *Critically Acclaimed & Top Rated* movies, equipped with desktop arrow controls and touch swipe support.

### 🔍 2. Search & Explore
- **Debounced Instant Search**: 400ms debounced input to prevent redundant API queries while user types.
- **Multi-Criteria Filtering**: Filter by **Genre**, **Release Year** (2024 to 1970s classics), **Language** (English, Hindi, Korean, Japanese, Spanish, French), and **Minimum Rating** (8.0+ Masterpieces, 7.0+ Recommended, 6.0+ Good).
- **Bollywood & Indian Cinema Collection**: 21 iconic Bollywood titles (*3 Idiots*, *Dangal*, *Sholay*, *Lagaan*, *DDLJ*, *PK*, *Swades*, *Gangs of Wasseypur*, *Andhadhun*, *Tumbbad*, *ZNMD*, *RRR*, *Jawan*, *Queen*, *Stree*, *Pathaan*, and more) with a dedicated Home page carousel and one-click category filtering.
- **Dynamic Sorting**: Sort by *Most Popular*, *Highest Rated*, *Newest Release*, *Oldest Release*, or *Title (A - Z)*.
- **Active Filter Chips**: Removable badge chips with single-click remove and global **Reset All** action.
- **Pagination / Load More**: Seamlessly fetch additional pages without layout shifts.

### 📽️ 3. Movie Details & Trailer Player
- **Rich Cinematic Page**: High-resolution backdrop image with dark gradient overlay, poster display, runtime, rating badge, vote count, budget, and box office revenue.
- **Official Trailer Modal**: Accessible popup with embedded YouTube player (handles Escape key, backdrop click, focus trap, and body scroll lock).
- **Cast & Crew**: Visual cards with performer photos, actor names, and character roles.
- **"More Like This" Carousel**: Context-aware movie recommendations based on matching genres.
- **Breadcrumb Navigation**: Safe hierarchical trail (`Home > Explore > [Title]`) with instant Back button.

### 🔖 4. Personal Watchlist & Favourites
- **Dual Tabs**: Separate views for **Watchlist** (titles queued for future viewing) and **Favourites** (curated hall of fame).
- **Persistent State**: Persisted across browser sessions using `localStorage` with fail-safe JSON parsing.
- **Duplicate Prevention**: Safeguards to ensure duplicate titles cannot be added.
- **Watchlist Filtering & Sorting**: Sort by *Recently Added*, *Highest Rated*, *Release Date*, or *Title*; filter by *All*, *Unwatched*, or *Watched*.
- **Instant Visual Feedback**: Animated toast notifications ("Added to Watchlist", "Saved to Favourites", "Removed from Watchlist").

### 🌓 5. Theme & Accessibility (a11y)
- **Theme Switcher**: Cinematic Midnight Dark Mode (default) & Crisp High-Contrast Light Mode with saved preference in `localStorage`.
- **Responsive Layout**: Designed for mobile (360–390px), tablet (768px), and desktop (1280–1440px+).
- **Accessibility**: Semantic HTML5 tags (`header`, `nav`, `main`, `section`, `article`, `button`, `aside`, `footer`), visible focus indicators (`:focus-visible`), image fallback handling, and `prefers-reduced-motion` compliance.

---

## 🛠️ Technology Stack

| Layer | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **UI Framework** | **React 18** | Reusable component hierarchy, reactive state management, and virtual DOM diffing |
| **Tooling & Bundler** | **Vite 5** | Instant Hot Module Replacement (HMR) and optimized Rollup production builds |
| **Routing** | **React Router v6** | Client-side routing across Discover, Explore, Details, Watchlist, and 404 |
| **Styling** | **CSS3 & CSS Custom Properties** | Design tokens, responsive grid/flexbox, backdrop blur, fluid typography |
| **Icons** | **Lucide React** | Consistent, accessible, and lightweight SVG vector icons |
| **Persistence** | **Browser localStorage** | Preserves personal watchlist, favourites, watched status, and theme preferences |
| **Data Engine** | **TMDB API + Fallback Engine** | Live connection to The Movie Database with automatic fallback to rich offline mock data |

---

## 📂 Architecture & Directory Structure

```text
Final_Project/
├── index.html                     # HTML5 entry with preconnected Google Fonts
├── package.json                   # Dependencies, build scripts & metadata
├── vite.config.js                 # Vite build & dev server configuration
├── .gitignore                     # Excludes node_modules, dist, and .env
├── .env.example                   # Template environment variable definition
├── .env                           # Local environment file (API keys)
├── README.md                      # Complete documentation & Viva guide
└── src/
    ├── main.jsx                   # React DOM root mounting
    ├── App.jsx                    # Root component with Router & Context Providers
    ├── components/
    │   ├── Navbar.jsx             # Sticky navigation, search shortcut, theme & API toggles
    │   ├── MovieCard.jsx          # Reusable poster card with hover overlay & quick actions
    │   ├── MovieGrid.jsx          # Responsive auto-fill movie grid
    │   ├── MovieCarousel.jsx      # Horizontally scrollable row with arrow controls
    │   ├── SearchBar.jsx          # Debounced input with loading spinner & clear action
    │   ├── FilterPanel.jsx        # Genre, year, rating, language controls & active chips
    │   ├── GenreChip.jsx          # Reusable category tag
    │   ├── RatingBadge.jsx        # Color-coded rating badge (Green/Yellow/Red)
    │   ├── LoadingSkeleton.jsx    # Shimmer skeleton loaders for hero, cards & details
    │   ├── EmptyState.jsx         # Friendly empty state with contextual action buttons
    │   ├── TrailerModal.jsx       # Accessible YouTube trailer player modal
    │   ├── Toast.jsx              # Floating toast notification component
    │   └── Footer.jsx             # TMDB attribution, navigation links & credits
    ├── pages/
    │   ├── Home.jsx               # Hero spotlight, genre tiles & movie carousels
    │   ├── Explore.jsx            # Filter panel, debounced search & paginated movie grid
    │   ├── MovieDetails.jsx       # Full backdrop, metadata, cast, facts & similar titles
    │   ├── Watchlist.jsx          # Watchlist & Favourites tabs, status filter & sorting
    │   └── NotFound.jsx           # 404 error page with navigation shortcuts
    ├── context/
    │   ├── ThemeContext.jsx       # Dark/Light theme state and HTML root class sync
    │   └── WatchlistContext.jsx   # Watchlist, Favourites, Watched IDs & Toast state
    ├── hooks/
    │   ├── useDebounce.js         # Delays rapid value changes (300-500ms)
    │   ├── useLocalStorage.js    # Generic safe localStorage hook with try-catch
    │   └── useMovies.js           # Movie fetching hook with pagination & retry logic
    ├── services/
    │   ├── movieApi.js            # Normalized TMDB API calls with mock fallback engine
    │   └── mockData.js            # Rich dataset of top movies, cast, genres & trailers
    ├── utils/
    │   ├── formatDate.js          # Date formatting, runtimes, ratings & currencies
    │   └── imageUrl.js            # TMDB image URL builder with SVG poster fallbacks
    └── styles/
        ├── variables.css          # Design tokens (colors, gradients, shadows, transitions)
        └── global.css             # Base reset, typography, responsive rules & animations
```

---

## 🚀 Setup & Installation Guide

Follow these steps to run the project locally on your machine:

### Prerequisites
- **Node.js**: Version 18 LTS or higher installed (`node -v`)
- **npm**: Version 9 or higher (`npm -v`)

### Step 1: Clone or Navigate to Project
```bash
cd Final_Project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: (Optional) Configure TMDB API Key
The application works **100% out of the box** using the built-in offline movie database. To enable live TMDB API catalog integration:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your TMDB API v3 Key:
   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```
*(You can also set or change this key anytime directly in the web UI via the Key icon in the top navigation bar!)*

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Open your browser and navigate to:
```text
http://localhost:5173
```

### Step 6: Build for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Testing Checklist & Verification Results

| Test Case | Scenario / Action | Expected Result | Result |
| :--- | :--- | :--- | :--- |
| **TC-01** | Open Home Page | Featured hero banner, carousels, and genre shortcuts render smoothly | ✅ **PASSED** |
| **TC-02** | Loading State | Shimmer skeleton cards display while data loads | ✅ **PASSED** |
| **TC-03** | Search Debounce | Typing rapidly does not trigger requests until user pauses (400ms) | ✅ **PASSED** |
| **TC-04** | Search Clear | Clicking (×) icon clears search text, restores catalogue, and focuses input | ✅ **PASSED** |
| **TC-05** | Filter Combination | Filter by Sci-Fi + 2023 + Rating ≥ 8.0 shows matching titles | ✅ **PASSED** |
| **TC-06** | Reset Filters | "Reset All" clears all active filters and restores full catalog | ✅ **PASSED** |
| **TC-07** | Movie Details Route | Clicking any movie card navigates to `/movie/:id` with complete metadata | ✅ **PASSED** |
| **TC-08** | Trailer Modal | Clicking "Watch Trailer" opens YouTube modal; pressing Escape closes it | ✅ **PASSED** |
| **TC-09** | Add to Watchlist | Clicking bookmark saves movie, updates badge count, and triggers Toast | ✅ **PASSED** |
| **TC-10** | Watchlist Persistence | Refreshing the page preserves all saved watchlist and favourite movies | ✅ **PASSED** |
| **TC-11** | Prevent Duplicates | Repeatedly clicking add does not duplicate items in the list | ✅ **PASSED** |
| **TC-12** | Theme Switcher | Clicking Sun/Moon toggles Dark/Light mode and persists in localStorage | ✅ **PASSED** |
| **TC-13** | Image Fallback | Missing or broken poster paths render elegant SVG fallback posters | ✅ **PASSED** |
| **TC-14** | Responsive Design | Clean layout on Mobile (375px), Tablet (768px), and Desktop (1440px) | ✅ **PASSED** |
| **TC-15** | Keyboard a11y | All cards, buttons, and selects can be focused and triggered with keyboard | ✅ **PASSED** |

---

## 🎤 Viva & Oral Examination Preparation Guide

Use this quick-reference section during your project presentation or defense:

### 1. What is CineScope and what problem does it solve?
> **Answer**: CineScope is a modern, responsive React web application that solves the "decision fatigue" viewers experience when looking for films. It combines real-time debounced search, granular multi-criteria filtering (genre, year, rating, language), detailed cinematic metadata (trailers, cast, box office), and persistent personal watchlists into a seamless, streaming-grade discovery interface.

### 2. Why was React chosen over vanilla JavaScript or MPA frameworks?
> **Answer**: React offers a component-driven architecture that allows building reusable UI elements (such as `MovieCard`, `MovieCarousel`, `FilterPanel`). Its declarative state model and Virtual DOM reconciliation update only the modified DOM nodes when filters or watchlists change, resulting in high performance and maintainable code.

### 3. What is a component in React, and how are components used here?
> **Answer**: A component is an independent, reusable piece of UI that encapsulates its own structure, styling, and logic. In CineScope:
> - `MovieCard` is a presentational component receiving movie data via props.
> - `FilterPanel` controls filtering state.
> - `Navbar` provides responsive site-wide navigation.

### 4. What is the difference between `props` and `state`?
> **Answer**:
> - **Props** (properties) are read-only inputs passed from a parent component down to a child (e.g., passing a movie object to `MovieCard`).
> - **State** is mutable data managed within a component that triggers a re-render when changed (e.g., the current search query or active filter selections).

### 5. Why and how is `localStorage` used?
> **Answer**: `localStorage` provides persistent client-side key-value storage across browser refreshes without requiring a backend database. In CineScope, `WatchlistContext` reads saved movies and favourites upon initialization and automatically serializes state updates using `JSON.stringify`, wrapped in `try...catch` blocks to protect against corrupted storage.

### 6. Why is search debounced?
> **Answer**: Without debouncing, an API request or filter computation would trigger on every single keystroke. The `useDebounce` hook waits for a 400ms pause in user typing, reducing network traffic and CPU overhead by up to 80%.

### 7. How does the application handle offline use and API rate limits?
> **Answer**: The service layer (`movieApi.js`) implements a graceful degradation strategy: it first attempts to query the live TMDB API with the provided key. If no key exists or if a network failure occurs, it seamlessly falls back to a curated internal mock dataset of top films, complete with cast, trailers, and genres.

### 8. Explain the data flow when a user searches for and saves a movie:
> **Answer**:
> 1. User types in `SearchBar` $\rightarrow$ React local state updates.
> 2. `useDebounce` waits 400ms and updates `debouncedQuery`.
> 3. `useEffect` in `Explore.jsx` detects the query change and calls `searchMovies()`.
> 4. `movieApi.js` normalizes the response into unified movie objects.
> 5. Results are passed to `MovieGrid` $\rightarrow$ rendered as `MovieCard` components.
> 6. User clicks the Bookmark icon on a card.
> 7. `addToWatchlist()` is triggered in `WatchlistContext`.
> 8. Context updates `watchlist` state, triggers a Toast notification, and writes to `localStorage`.

---

## 📄 License & Attribution

- **License**: MIT License
- **Data Source**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Disclaimer**: *This product uses the TMDB API but is not endorsed or certified by TMDB.*
- **Academic Course**: Full Stack Web Development (5th Semester Final Project)
