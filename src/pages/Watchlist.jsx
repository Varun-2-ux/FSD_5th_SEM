import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Trash2, ArrowUpDown, CheckCircle, Clock, Film } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';

export default function Watchlist() {
  const {
    watchlist,
    favourites,
    removeFromWatchlist,
    removeFromFavourites,
    clearAllWatchlist,
    isWatched,
    toggleWatched
  } = useWatchlist();

  const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist' | 'favourites'
  const [sortBy, setSortBy] = useState('addedAt.desc');
  const [filterWatched, setFilterWatched] = useState('all'); // 'all' | 'unwatched' | 'watched'

  // Current list based on active tab
  const rawList = activeTab === 'watchlist' ? watchlist : favourites;

  // Filter & Sort
  const processedList = useMemo(() => {
    let list = [...rawList];

    // Filter by watched status (only applies to watchlist)
    if (activeTab === 'watchlist' && filterWatched !== 'all') {
      if (filterWatched === 'watched') {
        list = list.filter(m => isWatched(m.id));
      } else if (filterWatched === 'unwatched') {
        list = list.filter(m => !isWatched(m.id));
      }
    }

    // Sort
    switch (sortBy) {
      case 'rating.desc':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'year.desc':
        list.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        break;
      case 'title.asc':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'addedAt.desc':
      default:
        list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        break;
    }

    return list;
  }, [rawList, activeTab, filterWatched, sortBy, isWatched]);

  const handleRemove = (id, title) => {
    if (activeTab === 'watchlist') {
      removeFromWatchlist(id, title);
    } else {
      removeFromFavourites(id, title);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all titles from your watchlist?')) {
      clearAllWatchlist();
    }
  };

  return (
    <main className="watchlist-page">
      <div className="container">
        {/* Header & Tabs */}
        <div className="watchlist-header">
          <div>
            <h1 className="page-title">
              {activeTab === 'watchlist' ? (
                <>
                  <Bookmark className="title-icon text-accent" />
                  <span>My Watchlist</span>
                </>
              ) : (
                <>
                  <Heart className="title-icon text-accent" />
                  <span>My Favourites</span>
                </>
              )}
            </h1>
            <p className="page-subtitle">
              Your personalized cinematic library saved locally on this browser.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="watchlist-tabs-nav" role="tablist" aria-label="Watchlist views">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'watchlist'}
              className={`watchlist-tab ${activeTab === 'watchlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('watchlist')}
            >
              <Bookmark size={16} />
              <span>Watchlist</span>
              <span className="tab-badge">{watchlist.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'favourites'}
              className={`watchlist-tab ${activeTab === 'favourites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favourites')}
            >
              <Heart size={16} />
              <span>Favourites</span>
              <span className="tab-badge">{favourites.length}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Sort, Status Filter, Clear All */}
        {rawList.length > 0 && (
          <div className="watchlist-toolbar">
            <div className="watchlist-controls-left">
              {/* Sort Selector */}
              <div className="control-group">
                <label htmlFor="watchlist-sort" className="control-label">
                  <ArrowUpDown size={14} />
                  <span>Sort By:</span>
                </label>
                <select
                  id="watchlist-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select compact-select"
                >
                  <option value="addedAt.desc">Recently Added</option>
                  <option value="rating.desc">Highest Rated</option>
                  <option value="year.desc">Release Date</option>
                  <option value="title.asc">Title (A - Z)</option>
                </select>
              </div>

              {/* Status filter (watchlist only) */}
              {activeTab === 'watchlist' && (
                <div className="control-group">
                  <span className="control-label">Status:</span>
                  <div className="status-toggle-pill">
                    <button
                      type="button"
                      className={`pill-btn ${filterWatched === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterWatched('all')}
                    >
                      All ({watchlist.length})
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${filterWatched === 'unwatched' ? 'active' : ''}`}
                      onClick={() => setFilterWatched('unwatched')}
                    >
                      Unwatched
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${filterWatched === 'watched' ? 'active' : ''}`}
                      onClick={() => setFilterWatched('watched')}
                    >
                      Watched
                    </button>
                  </div>
                </div>
              )}
            </div>

            {activeTab === 'watchlist' && watchlist.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="btn btn-ghost clear-all-btn"
                title="Remove all movies from watchlist"
              >
                <Trash2 size={16} />
                <span>Clear List</span>
              </button>
            )}
          </div>
        )}

        {/* Saved Movies Grid or Empty State */}
        {processedList.length === 0 ? (
          <EmptyState
            type={activeTab === 'watchlist' ? 'watchlist' : 'favourites'}
            title={
              rawList.length === 0
                ? activeTab === 'watchlist'
                  ? 'Your Watchlist is Empty'
                  : 'No Favourites Saved Yet'
                : 'No titles match this filter'
            }
            message={
              rawList.length === 0
                ? activeTab === 'watchlist'
                  ? 'Explore the catalogue, tap the bookmark icon on any film, and build your custom watch queue!'
                  : 'Click the heart icon on films you love to curate your personal hall of fame.'
                : 'Try changing your status filter above to see all saved titles.'
            }
            actionText="Discover Movies"
            actionLink="/explore"
          />
        ) : (
          <div className="watchlist-content">
            <MovieGrid
              movies={processedList}
              showRemove={true}
              onRemove={handleRemove}
            />
          </div>
        )}
      </div>
    </main>
  );
}
