import { MOCK_MOVIES, MOCK_GENRES } from './mockData.js';

const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to get active TMDB API key from env or user storage
export const getApiKey = () => {
  try {
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_API_KEY) || '';
    const localKey = (typeof localStorage !== 'undefined' && localStorage.getItem('tmdb_custom_api_key')) || '';
    return (envKey || localKey || '').trim();
  } catch {
    return '';
  }
};

export const setCustomApiKey = (key) => {
  if (key) {
    localStorage.setItem('tmdb_custom_api_key', key.trim());
  } else {
    localStorage.removeItem('tmdb_custom_api_key');
  }
};

/**
 * Normalizes TMDB movie object into application schema
 */
export const normalizeMovie = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title || item.original_title || 'Untitled',
    originalTitle: item.original_title || item.title || '',
    posterPath: item.poster_path || item.posterPath || null,
    backdropPath: item.backdrop_path || item.backdropPath || null,
    overview: item.overview || 'No overview available for this title.',
    releaseDate: item.release_date || item.releaseDate || '',
    rating: typeof item.vote_average === 'number' ? item.vote_average : (item.rating || 0),
    voteCount: item.vote_count || item.voteCount || 0,
    genreIds: item.genre_ids || (item.genres ? item.genres.map(g => g.id) : item.genreIds) || [],
    originalLanguage: item.original_language || item.originalLanguage || 'en',
    runtime: item.runtime || null,
    tagline: item.tagline || '',
    status: item.status || 'Released',
    budget: item.budget || 0,
    revenue: item.revenue || 0,
    genres: item.genres || [],
    trailerYoutubeId: item.trailerYoutubeId || null,
    isAnime: Boolean(item.isAnime || item.original_language === 'ja' || item.originalLanguage === 'ja'),
    cast: item.cast || []
  };
};

/**
 * Generic fetch wrapper for TMDB API with error handling and mock fallback
 */
async function fetchFromTmdb(endpoint, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    // No API key configured -> use mock engine
    return null;
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.warn(`TMDB API request failed with status: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn('Network error while connecting to TMDB API:', err);
    return null;
  }
}

/**
 * 1. Fetch Trending Movies
 */
export async function getTrendingMovies(timeWindow = 'day') {
  const data = await fetchFromTmdb(`/trending/movie/${timeWindow}`);
  if (data && data.results) {
    return {
      results: data.results.map(normalizeMovie),
      page: data.page,
      totalPages: data.total_pages,
      isLive: true
    };
  }

  // Fallback to mock: diverse trending across Hollywood, Bollywood, and Anime
  await simulateDelay(250);
  const featured = MOCK_MOVIES.filter(m => m.featured);
  const animePicks = MOCK_MOVIES.filter(m => m.isAnime || m.originalLanguage === 'ja').slice(0, 5);
  const bollywoodPicks = MOCK_MOVIES.filter(m => m.originalLanguage === 'hi').slice(0, 7);
  const globalPicks = MOCK_MOVIES.filter(m => m.originalLanguage === 'en').slice(0, 12);

  const seen = new Set();
  const mixedTrending = [...featured, ...animePicks, ...bollywoodPicks, ...globalPicks].filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  return {
    results: mixedTrending.map(normalizeMovie),
    page: 1,
    totalPages: 1,
    isLive: false
  };
}

/**
 * 2. Fetch Popular Movies
 */
export async function getPopularMovies(page = 1) {
  const data = await fetchFromTmdb('/movie/popular', { page });
  if (data && data.results) {
    return {
      results: data.results.map(normalizeMovie),
      page: data.page,
      totalPages: data.total_pages,
      isLive: true
    };
  }

  // Fallback to mock
  await simulateDelay(200);
  return {
    results: MOCK_MOVIES.map(normalizeMovie),
    page: 1,
    totalPages: 1,
    isLive: false
  };
}

/**
 * 3. Fetch Top Rated Movies
 */
export async function getTopRatedMovies(page = 1) {
  const data = await fetchFromTmdb('/movie/top_rated', { page });
  if (data && data.results) {
    return {
      results: data.results.map(normalizeMovie),
      page: data.page,
      totalPages: data.total_pages,
      isLive: true
    };
  }

  // Fallback to mock
  await simulateDelay(200);
  const sorted = [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating);
  return {
    results: sorted.map(normalizeMovie),
    page: 1,
    totalPages: 1,
    isLive: false
  };
}

/**
 * 4. Fetch Movie Genres
 */
export async function getGenres() {
  const data = await fetchFromTmdb('/genre/movie/list');
  if (data && data.genres) {
    return data.genres;
  }
  return MOCK_GENRES;
}

/**
 * 5. Search Movies by Title, Actor, Tagline, or Genre with fuzzy matching
 */
export async function searchMovies(query, page = 1, filters = {}) {
  if (!query || !query.trim()) {
    return { results: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  const cleanQuery = query.trim();
  const apiKey = getApiKey();

  // If live TMDB key exists, try live search first
  if (apiKey) {
    const data = await fetchFromTmdb('/search/movie', { query: cleanQuery, page });
    if (data && data.results && data.results.length > 0) {
      let liveList = data.results.map(normalizeMovie);
      // Apply filters if any
      if (filters.genreId) {
        const gId = Number(filters.genreId);
        liveList = liveList.filter(m => m.genreIds.includes(gId));
      }
      if (filters.language) {
        liveList = liveList.filter(m => m.originalLanguage === filters.language);
      }
      if (filters.minRating) {
        liveList = liveList.filter(m => m.rating >= Number(filters.minRating));
      }
      return {
        results: liveList,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
        isLive: true
      };
    }
  }

  // Enhanced Client Search over MOCK_MOVIES
  await simulateDelay(150);
  const normalizeText = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const stripNoise = (str) =>
    normalizeText(str)
      .replace(/[^a-z0-9]/g, '')
      .replace(/aa/g, 'a')
      .replace(/ee/g, 'i')
      .replace(/oo/g, 'u');

  const qLower = normalizeText(cleanQuery);
  const qAlpha = stripNoise(cleanQuery);
  const tokens = qLower.split(/\s+/).filter(Boolean);

  let filtered = MOCK_MOVIES.filter(m => {
    const titleLower = normalizeText(m.title);
    const titleAlpha = stripNoise(m.title);
    const originalTitle = normalizeText(m.originalTitle);
    const overview = normalizeText(m.overview);
    const tagline = normalizeText(m.tagline);
    const castNames = (m.cast || []).map(c => normalizeText(c.name)).join(' ');

    // 1. Direct contains or alphanumeric match (e.g. "spider man" matches "Spider-Man", "3idiots" matches "3 Idiots", "baahubali" matches "Bāhubali")
    if (titleLower.includes(qLower) || titleAlpha.includes(qAlpha)) return true;
    if (originalTitle.includes(qLower)) return true;

    // 2. Acronym match (e.g. "ddlj" -> "Dilwale Dulhania Le Jayenge", "znmd" -> "Zindagi Na Milegi Dobara")
    const acronym = titleLower.split(/\s+/).map(w => w[0]).join('');
    if (qAlpha.length >= 3 && acronym.includes(qAlpha)) return true;

    // 3. Cast member match (e.g. searching "Aamir Khan", "Shah Rukh", "Cillian", "Zendaya", "DiCaprio", "Makoto Shinkai")
    if (castNames.includes(qLower) || stripNoise(castNames).includes(qAlpha)) return true;

    // 4. Multi-token match across title, tagline, overview
    const fullText = `${titleLower} ${tagline} ${overview} ${castNames}`;
    const allTokensMatch = tokens.every(token => fullText.includes(token));
    if (allTokensMatch) return true;

    // 5. Category / Keyword intent matches (e.g. searching "anime", "bollywood", "hindi", "japanese")
    if (qLower === 'anime' && (m.isAnime || m.originalLanguage === 'ja' || m.genreIds.includes(16))) return true;
    if ((qLower === 'bollywood' || qLower === 'hindi') && m.originalLanguage === 'hi') return true;
    if (qLower === 'japanese' && m.originalLanguage === 'ja') return true;

    return false;
  });

  // Apply filters if provided
  if (filters.genreId) {
    const gId = Number(filters.genreId);
    filtered = filtered.filter(m => m.genreIds.includes(gId));
  }
  if (filters.year) {
    const yStr = String(filters.year);
    filtered = filtered.filter(m => (m.releaseDate || '').startsWith(yStr));
  }
  if (filters.language) {
    filtered = filtered.filter(m => m.originalLanguage === filters.language);
  }
  if (filters.minRating) {
    filtered = filtered.filter(m => (m.rating || 0) >= Number(filters.minRating));
  }

  // Sort search results by relevance
  filtered.sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aStarts = aTitle.startsWith(qLower);
    const bStarts = bTitle.startsWith(qLower);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    const aExact = aTitle === qLower;
    const bExact = bTitle === qLower;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    return (b.rating || 0) - (a.rating || 0);
  });

  return {
    results: filtered.map(normalizeMovie),
    page: 1,
    totalPages: 1,
    totalResults: filtered.length,
    isLive: false
  };
}

/**
 * 6. Discover Movies with Filters & Sorting
 */
export async function discoverMovies({
  genreId,
  year,
  language,
  minRating,
  sortBy = 'popularity.desc',
  page = 1
} = {}) {
  const params = { page };

  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;
  if (language) params.with_original_language = language;
  if (minRating) params['vote_average.gte'] = minRating;
  if (sortBy) params.sort_by = sortBy;

  const data = await fetchFromTmdb('/discover/movie', params);
  if (data && data.results) {
    return {
      results: data.results.map(normalizeMovie),
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      isLive: true
    };
  }

  // Mock Discover & Filter engine
  await simulateDelay(250);
  let list = [...MOCK_MOVIES];

  if (genreId) {
    const gId = Number(genreId);
    list = list.filter(m => m.genreIds.includes(gId));
  }

  if (year) {
    const yStr = String(year);
    list = list.filter(m => m.releaseDate.startsWith(yStr));
  }

  if (language) {
    list = list.filter(m => m.originalLanguage === language);
  }

  if (minRating) {
    const rNum = Number(minRating);
    list = list.filter(m => m.rating >= rNum);
  }

  // Sorting
  if (sortBy === 'vote_average.desc' || sortBy === 'rating.desc') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'primary_release_date.desc' || sortBy === 'release_date.desc') {
    list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  } else if (sortBy === 'primary_release_date.asc' || sortBy === 'release_date.asc') {
    list.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  } else if (sortBy === 'title.asc') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default popularity
    list.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  }

  return {
    results: list.map(normalizeMovie),
    page: 1,
    totalPages: 1,
    totalResults: list.length,
    isLive: false
  };
}

/**
 * 7. Fetch Full Movie Details
 */
export async function getMovieDetails(movieId) {
  const data = await fetchFromTmdb(`/movie/${movieId}`);
  if (data) {
    return normalizeMovie(data);
  }

  // Fallback to mock data
  await simulateDelay(200);
  const found = MOCK_MOVIES.find(m => String(m.id) === String(movieId));
  if (found) {
    return normalizeMovie(found);
  }

  // If not found in mock, return a synthetic movie shell
  return {
    id: movieId,
    title: `Film #${movieId}`,
    overview: 'Detailed metadata could not be retrieved from the server. Check your connection or API key.',
    releaseDate: '2024-01-01',
    rating: 7.5,
    genreIds: [28, 878],
    genres: [{ id: 28, name: 'Action' }],
    originalLanguage: 'en',
    runtime: 120
  };
}

/**
 * 8. Fetch Movie Credits (Cast & Crew)
 */
export async function getMovieCredits(movieId) {
  const data = await fetchFromTmdb(`/movie/${movieId}/credits`);
  if (data && data.cast) {
    return {
      cast: data.cast.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path
      })),
      crew: data.crew ? data.crew.slice(0, 5) : []
    };
  }

  // Mock cast
  const found = MOCK_MOVIES.find(m => String(m.id) === String(movieId));
  if (found && found.cast) {
    return { cast: found.cast, crew: [] };
  }

  return {
    cast: [
      { id: 101, name: 'Lead Performer', character: 'Hero', profilePath: null },
      { id: 102, name: 'Supporting Performer', character: 'Ally', profilePath: null }
    ],
    crew: []
  };
}

/**
 * 9. Fetch Similar Movies
 */
export async function getSimilarMovies(movieId) {
  const data = await fetchFromTmdb(`/movie/${movieId}/similar`);
  if (data && data.results && data.results.length > 0) {
    return data.results.map(normalizeMovie);
  }

  // Mock similar
  const current = MOCK_MOVIES.find(m => String(m.id) === String(movieId));
  const similar = MOCK_MOVIES.filter(m => {
    if (String(m.id) === String(movieId)) return false;
    if (current && current.genreIds.some(g => m.genreIds.includes(g))) return true;
    return false;
  });

  return (similar.length > 0 ? similar : MOCK_MOVIES.slice(0, 6)).map(normalizeMovie);
}

/**
 * 10. Fetch Movie Videos (Trailers)
 */
export async function getMovieVideos(movieId) {
  const data = await fetchFromTmdb(`/movie/${movieId}/videos`);
  if (data && data.results) {
    const officialTrailer = data.results.find(
      v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    if (officialTrailer) {
      return officialTrailer.key;
    }
  }

  const found = MOCK_MOVIES.find(m => String(m.id) === String(movieId));
  return found?.trailerYoutubeId || null;
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
