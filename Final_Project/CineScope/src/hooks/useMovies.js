import { useState, useEffect, useCallback } from 'react';

/**
 * Reusable hook for fetching movie lists, tracking loading, error and retry logic
 *
 * @param {Function} fetchFn - Async function returning { results, totalPages, isLive }
 * @param {Array} dependencies - Dependency array to trigger refetch
 */
export function useMovies(fetchFn, dependencies = []) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      if (data) {
        setMovies(data.results || []);
        setIsLive(!!data.isLive);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error('Error in useMovies hook:', err);
      setError('Unable to load movie data at this time. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    movies,
    loading,
    error,
    isLive,
    page,
    totalPages,
    refetch: loadData,
    setMovies
  };
}
