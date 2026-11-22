import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Filter, RefreshCw, Loader2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import MovieGrid from '../components/MovieGrid';
import { searchMovies, discoverMovies, getGenres } from '../services/movieApi';
import { useDebounce } from '../hooks/useDebounce';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial URL params
  const urlQuery = searchParams.get('q') || '';
  const urlGenre = searchParams.get('genre') || '';
  const urlLang = searchParams.get('lang') || '';

  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 250);

  const [filters, setFilters] = useState({
    genreId: urlGenre,
    year: '',
    language: urlLang,
    minRating: '',
    sortBy: 'popularity.desc'
  });

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Request race-condition counter: guarantees older tasks cannot overwrite newer task outputs
  const activeRequestId = useRef(0);

  // Load genres
  useEffect(() => {
    getGenres().then(list => setGenres(list || []));
  }, []);

  // Sync state if URL changes externally (e.g. from navbar search or back/forward navigation)
  useEffect(() => {
    const currentUrlQ = searchParams.get('q') || '';
    const currentUrlGenre = searchParams.get('genre') || '';
    const currentUrlLang = searchParams.get('lang') || '';

    // Only update if URL differs from current debounced values to avoid circular trigger loops
    if (currentUrlQ !== query && currentUrlQ !== debouncedQuery) {
      setQuery(currentUrlQ);
    }

    setFilters(prev => {
      if (prev.genreId !== currentUrlGenre || prev.language !== currentUrlLang) {
        return {
          ...prev,
          genreId: currentUrlGenre,
          language: currentUrlLang
        };
      }
      return prev;
    });
  }, [searchParams]);

  // Sync URL params when debounced search or filters change (avoids firing on every keystroke)
  useEffect(() => {
    const params = {};
    if (debouncedQuery.trim()) params.q = debouncedQuery.trim();
    if (filters.genreId) params.genre = filters.genreId;
    if (filters.language) params.lang = filters.language;

    // Check if URL params already match to avoid redundant router pushes
    const currentQ = searchParams.get('q') || '';
    const currentGenre = searchParams.get('genre') || '';
    const currentLang = searchParams.get('lang') || '';

    if (
      currentQ !== (params.q || '') ||
      currentGenre !== (params.genre || '') ||
      currentLang !== (params.lang || '')
    ) {
      setSearchParams(params, { replace: true });
    }
  }, [debouncedQuery, filters.genreId, filters.language, setSearchParams]);

  // Main data fetch function with race condition prevention
  const fetchMoviesData = useCallback(async (isLoadMore = false, pageNum = 1, overrideQuery = null) => {
    // Generate a unique incremental ID for this fetch task
    const thisRequestId = ++activeRequestId.current;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const activeQuery = (overrideQuery !== null ? overrideQuery : debouncedQuery).trim();

    try {
      let data;
      if (activeQuery) {
        data = await searchMovies(activeQuery, pageNum, filters);
      } else {
        data = await discoverMovies({
          genreId: filters.genreId,
          year: filters.year,
          language: filters.language,
          minRating: filters.minRating,
          sortBy: filters.sortBy,
          page: pageNum
        });
      }

      // Check if a newer task was started while this task was running
      if (thisRequestId !== activeRequestId.current) {
        // Discard stale task output
        return;
      }

      if (data && data.results) {
        if (isLoadMore) {
          setMovies(prev => [...prev, ...data.results]);
        } else {
          setMovies(data.results);
        }
        setPage(data.page || pageNum);
        setTotalPages(data.totalPages || 1);
      } else {
        if (!isLoadMore) setMovies([]);
      }
    } catch (err) {
      // Ignore errors from superseded tasks
      if (thisRequestId !== activeRequestId.current) return;

      console.error('Error fetching explore movies:', err);
      setError('Unable to load movies. Please check your network and try again.');
    } finally {
      // Only release loading state if this is still the active task
      if (thisRequestId === activeRequestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [debouncedQuery, filters]);

  // Refetch when debounced query or filters change
  useEffect(() => {
    setPage(1);
    fetchMoviesData(false, 1);
  }, [fetchMoviesData]);

  // Handle immediate search (Enter key submission)
  const handleImmediateSearch = (immediateQuery) => {
    setPage(1);
    fetchMoviesData(false, 1, immediateQuery);
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      fetchMoviesData(true, page + 1);
    }
  };

  const handleResetFilters = () => {
    setQuery('');
    setFilters({
      genreId: '',
      year: '',
      language: '',
      minRating: '',
      sortBy: 'popularity.desc'
    });
  };

  return (
    <main className="explore-page">
      <div className="container">
        {/* Header */}
        <div className="explore-header">
          <div className="explore-title-group">
            <h1 className="page-title">
              <Compass className="title-icon text-accent" />
              <span>Explore & Search</span>
            </h1>
            <p className="page-subtitle">
              Browse the catalog by genre, release year, audience rating, or search any title, actor, or franchise.
            </p>
          </div>

          {/* Search Bar */}
          <div className="explore-search-container">
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              onSearch={handleImmediateSearch}
              loading={loading && Boolean(query)}
              placeholder="Search by title (e.g. 3 Idiots, Batman, Dune) or actor..."
              autoFocus={true}
            />
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          genres={genres}
          totalResults={movies.length}
        />

        {/* Status / Count bar */}
        <div className="results-status-bar">
          <div className="results-count">
            {loading ? (
              <span>Searching titles...</span>
            ) : (
              <span>
                Showing <strong>{movies.length}</strong> {movies.length === 1 ? 'title' : 'titles'}
                {query.trim() && <> matching “<em>{query.trim()}</em>”</>}
              </span>
            )}
          </div>
        </div>

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          emptyType="search"
          emptyTitle={query.trim() ? `No results for "${query.trim()}"` : 'No movies found matching filters'}
          emptyMessage="Try searching with different keywords, actor names, or clearing your active filters."
          onReset={handleResetFilters}
        />

        {/* Load More Button */}
        {!loading && movies.length > 0 && page < totalPages && (
          <div className="load-more-container">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="btn btn-secondary load-more-btn"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Loading additional titles...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  <span>Load More Movies (Page {page} of {totalPages})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
