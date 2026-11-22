import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Info, Bookmark, Star, Sparkles, ChevronRight, TrendingUp, Award, Flame } from 'lucide-react';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getGenres, getMovieVideos } from '../services/movieApi';
import { useWatchlist } from '../context/WatchlistContext';
import { getBackdropUrl, getImageUrl } from '../utils/imageUrl';
import { getReleaseYear, formatRating } from '../utils/formatDate';
import MovieCarousel from '../components/MovieCarousel';
import RatingBadge from '../components/RatingBadge';
import TrailerModal from '../components/TrailerModal';
import { HeroSkeleton } from '../components/LoadingSkeleton';

export default function Home() {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [anime, setAnime] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero state
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerKey, setActiveTrailerKey] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setLoading(true);
      setError(null);
      try {
        const [trendingRes, popularRes, topRatedRes, genreRes] = await Promise.all([
          getTrendingMovies('day'),
          getPopularMovies(1),
          getTopRatedMovies(1),
          getGenres()
        ]);

        if (isMounted) {
          const popList = popularRes?.results || [];
          setTrending(trendingRes?.results || []);
          setPopular(popList);
          setTopRated(topRatedRes?.results || []);
          setGenres(genreRes || []);

          // Filter Bollywood and Anime movies
          const bList = popList.filter(m => m.originalLanguage === 'hi');
          setBollywood(bList);

          const aList = popList.filter(m => m.isAnime || m.originalLanguage === 'ja');
          setAnime(aList);
        }
      } catch (err) {
        console.error('Failed to load home page movies:', err);
        if (isMounted) {
          setError('Failed to load catalogue. Please check connection and retry.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredMovie = trending[featuredIndex] || popular[0] || null;

  const handleOpenTrailer = async (movie) => {
    if (!movie) return;
    try {
      const key = await getMovieVideos(movie.id);
      setActiveTrailerKey(key);
      setTrailerModalOpen(true);
    } catch {
      setActiveTrailerKey(null);
      setTrailerModalOpen(true);
    }
  };

  const genreBadges = [
    { id: 28, name: 'Action', icon: '💥' },
    { id: 878, name: 'Sci-Fi', icon: '🚀' },
    { id: 'bollywood', name: 'Bollywood', icon: '🇮🇳', isLang: true, lang: 'hi' },
    { id: 'anime', name: 'Anime', icon: '🎌', isLang: true, lang: 'ja' },
    { id: 18, name: 'Drama', icon: '🎭' },
    { id: 16, name: 'Animation', icon: '🎨' },
    { id: 35, name: 'Comedy', icon: '😂' },
    { id: 53, name: 'Thriller', icon: '⚡' },
    { id: 12, name: 'Adventure', icon: '🗺️' }
  ];

  return (
    <main className="home-page">
      {/* 1. HERO BANNER */}
      {loading ? (
        <HeroSkeleton />
      ) : featuredMovie ? (
        <section className="hero-banner" aria-label="Featured Movie">
          <div
            className="hero-backdrop"
            style={{
              backgroundImage: `url(${getBackdropUrl(featuredMovie.backdropPath, 'original')})`
            }}
          >
            <div className="hero-gradient-overlay" />
          </div>

          <div className="container hero-content-wrapper">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="eyebrow-pill">
                  <Flame size={14} className="eyebrow-icon text-accent" />
                  Featured Spotlight
                </span>
                <span className="hero-year">{getReleaseYear(featuredMovie.releaseDate)}</span>
                <RatingBadge rating={featuredMovie.rating} size="sm" />
              </div>

              <h1 className="hero-title">{featuredMovie.title}</h1>

              {featuredMovie.tagline && (
                <p className="hero-tagline">“{featuredMovie.tagline}”</p>
              )}

              <p className="hero-overview">
                {featuredMovie.overview?.length > 220
                  ? featuredMovie.overview.slice(0, 220) + '...'
                  : featuredMovie.overview}
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                  className="btn btn-primary hero-btn-main"
                >
                  <Info size={18} />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenTrailer(featuredMovie)}
                  className="btn btn-secondary hero-btn-sub"
                >
                  <Play size={18} />
                  <span>Watch Trailer</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWatchlist(featuredMovie)}
                  className={`btn btn-secondary hero-btn-sub ${
                    isInWatchlist(featuredMovie.id) ? 'btn-saved' : ''
                  }`}
                  aria-label={
                    isInWatchlist(featuredMovie.id)
                      ? 'Remove featured movie from watchlist'
                      : 'Add featured movie to watchlist'
                  }
                >
                  <Bookmark
                    size={18}
                    fill={isInWatchlist(featuredMovie.id) ? 'currentColor' : 'none'}
                  />
                  <span>
                    {isInWatchlist(featuredMovie.id) ? 'In Watchlist' : 'Add to List'}
                  </span>
                </button>
              </div>
            </div>

            {/* Hero Quick Switcher Dots */}
            {trending.length > 1 && (
              <div className="hero-dots" aria-label="Featured spotlight selector">
                {trending.slice(0, 5).map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`hero-dot ${idx === featuredIndex ? 'active' : ''}`}
                    onClick={() => setFeaturedIndex(idx)}
                    aria-label={`Show featured title ${idx + 1}: ${m.title}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* 2. GENRE SHORTCUTS BAR */}
      <section className="container genre-shortcuts-section" aria-label="Browse by category">
        <div className="section-header-compact">
          <h3 className="section-title-sm">
            <Sparkles size={18} className="text-accent" />
            <span>Popular Categories</span>
          </h3>
          <Link to="/explore" className="see-all-link">
            <span>Explore All</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="genre-shortcuts-grid">
          {genreBadges.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => navigate(g.isLang ? `/explore?lang=${g.lang}` : `/explore?genre=${g.id}`)}
              className="genre-shortcut-card"
            >
              <span className="genre-shortcut-icon">{g.icon}</span>
              <span className="genre-shortcut-name">{g.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. TRENDING NOW CAROUSEL */}
      <div className="container">
        <MovieCarousel
          title="Trending Now"
          subtitle="Top motion pictures making waves globally this week"
          badge="TRENDING"
          movies={trending}
          loading={loading}
        />
      </div>

      {/* 4. BOLLYWOOD & INDIAN CINEMA */}
      {bollywood.length > 0 && (
        <div className="container">
          <MovieCarousel
            title="Bollywood & Indian Cinema"
            subtitle="Iconic masterworks, heartfelt dramas, and timeless blockbusters"
            badge="BOLLYWOOD"
            movies={bollywood}
            loading={loading}
          />
        </div>
      )}

      {/* 5. ANIME MASTERPIECES */}
      {anime.length > 0 && (
        <div className="container">
          <MovieCarousel
            title="Anime Classics & Modern Hits"
            subtitle="Breathtaking animation, emotional storytelling, and legendary sagas"
            badge="ANIME"
            movies={anime}
            loading={loading}
          />
        </div>
      )}

      {/* 5. POPULAR MOVIES ROW */}
      <div className="container">
        <MovieCarousel
          title="Most Popular"
          subtitle="Fan favorites and high-demand cinematic experiences"
          movies={popular}
          loading={loading}
        />
      </div>

      {/* 5. TOP RATED MASTERPIECES */}
      <div className="container">
        <MovieCarousel
          title="Critically Acclaimed & Top Rated"
          subtitle="All-time cinematic legends rated highest by audiences"
          badge="TOP RATED"
          movies={topRated}
          loading={loading}
        />
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        trailerKey={activeTrailerKey}
        movieTitle={featuredMovie?.title || 'Movie'}
      />
    </main>
  );
}
