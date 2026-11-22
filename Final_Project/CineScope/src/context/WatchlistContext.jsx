import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext();

const STORAGE_KEYS = {
  WATCHLIST: 'cinescope_watchlist_items',
  FAVOURITES: 'cinescope_favourite_items',
  WATCHED: 'cinescope_watched_ids'
};

export function WatchlistProvider({ children }) {
  // Safe localStorage loader
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to parse watchlist from localStorage:', e);
      return [];
    }
  });

  const [favourites, setFavourites] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to parse favourites from localStorage:', e);
      return [];
    }
  });

  const [watchedIds, setWatchedIds] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHED);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to parse watched IDs from localStorage:', e);
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage:', e);
    }
  }, [watchlist]);

  // Sync favourites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
    } catch (e) {
      console.warn('Failed to save favourites to localStorage:', e);
    }
  }, [favourites]);

  // Sync watchedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(watchedIds));
    } catch (e) {
      console.warn('Failed to save watched IDs to localStorage:', e);
    }
  }, [watchedIds]);

  // Toast notification helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Helper to extract compact movie representation
  const toCompactMovie = (movie) => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    backdropPath: movie.backdropPath,
    releaseDate: movie.releaseDate,
    rating: movie.rating,
    genreIds: movie.genreIds || [],
    overview: movie.overview ? movie.overview.slice(0, 150) + '...' : '',
    addedAt: Date.now()
  });

  // Watchlist methods
  const isInWatchlist = useCallback((movieId) => {
    return watchlist.some(m => String(m.id) === String(movieId));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie) => {
    if (!movie || !movie.id) return;
    setWatchlist(prev => {
      if (prev.some(m => String(m.id) === String(movie.id))) {
        return prev; // prevent duplicate
      }
      return [toCompactMovie(movie), ...prev];
    });
    showToast(`Added "${movie.title}" to your Watchlist`, 'success');
  }, [showToast]);

  const removeFromWatchlist = useCallback((movieId, movieTitle) => {
    setWatchlist(prev => prev.filter(m => String(m.id) !== String(movieId)));
    showToast(
      movieTitle ? `Removed "${movieTitle}" from Watchlist` : 'Removed from Watchlist',
      'info'
    );
  }, [showToast]);

  const toggleWatchlist = useCallback((movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id, movie.title);
    } else {
      addToWatchlist(movie);
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  // Favourites methods
  const isFavourite = useCallback((movieId) => {
    return favourites.some(m => String(m.id) === String(movieId));
  }, [favourites]);

  const addToFavourites = useCallback((movie) => {
    if (!movie || !movie.id) return;
    setFavourites(prev => {
      if (prev.some(m => String(m.id) === String(movie.id))) {
        return prev;
      }
      return [toCompactMovie(movie), ...prev];
    });
    showToast(`Saved "${movie.title}" to Favourites`, 'success');
  }, [showToast]);

  const removeFromFavourites = useCallback((movieId, movieTitle) => {
    setFavourites(prev => prev.filter(m => String(m.id) !== String(movieId)));
    showToast(
      movieTitle ? `Removed "${movieTitle}" from Favourites` : 'Removed from Favourites',
      'info'
    );
  }, [showToast]);

  const toggleFavourite = useCallback((movie) => {
    if (isFavourite(movie.id)) {
      removeFromFavourites(movie.id, movie.title);
    } else {
      addToFavourites(movie);
    }
  }, [isFavourite, addToFavourites, removeFromFavourites]);

  // Watched status methods
  const isWatched = useCallback((movieId) => {
    return watchedIds.includes(Number(movieId)) || watchedIds.includes(String(movieId));
  }, [watchedIds]);

  const toggleWatched = useCallback((movieId) => {
    setWatchedIds(prev => {
      const idNum = Number(movieId);
      if (prev.includes(idNum)) {
        return prev.filter(id => id !== idNum);
      } else {
        return [...prev, idNum];
      }
    });
  }, []);

  const clearAllWatchlist = useCallback(() => {
    setWatchlist([]);
    showToast('Watchlist cleared', 'info');
  }, [showToast]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        favourites,
        watchedIds,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isFavourite,
        addToFavourites,
        removeFromFavourites,
        toggleFavourite,
        isWatched,
        toggleWatched,
        clearAllWatchlist,
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
