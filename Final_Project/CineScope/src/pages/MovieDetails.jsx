import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Bookmark,
  Heart,
  Play,
  Globe,
  DollarSign,
  ChevronRight,
  Share2
} from 'lucide-react';
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos
} from '../services/movieApi';
import { useWatchlist } from '../context/WatchlistContext';
import { getBackdropUrl, getImageUrl, getProfileUrl } from '../utils/imageUrl';
import { formatDate, getReleaseYear, formatRuntime, formatRating, formatCurrency } from '../utils/formatDate';
import RatingBadge from '../components/RatingBadge';
import GenreChip from '../components/GenreChip';
import MovieCarousel from '../components/MovieCarousel';
import TrailerModal from '../components/TrailerModal';
import { MovieDetailsSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist, isFavourite, toggleFavourite, showToast } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadMovieData() {
      setLoading(true);
      setError(null);
      try {
        const [movieData, creditsData, similarData, videoKey] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getSimilarMovies(id),
          getMovieVideos(id)
        ]);

        if (isMounted) {
          if (!movieData) {
            setError('Movie details could not be found.');
          } else {
            setMovie(movieData);
            setCast(creditsData?.cast || []);
            setSimilar(similarData || []);
            setTrailerKey(videoKey || null);
          }
        }
      } catch (err) {
        console.error('Error loading movie details:', err);
        if (isMounted) {
          setError('Failed to retrieve movie details. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadMovieData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className="container details-error-container">
        <EmptyState
          type="error"
          title="Movie Not Found"
          message={error || 'We were unable to locate this title.'}
          actionText="Back to Explore"
          actionLink="/explore"
        />
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const inFavourites = isFavourite(movie.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on CineScope!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Movie link copied to clipboard!', 'info');
    }
  };

  return (
    <article className="movie-details-page">
      {/* 1. CINEMATIC BACKDROP BANNER */}
      <div className="details-hero-banner">
        <div
          className="details-backdrop-image"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdropPath, 'original')})`
          }}
        />
        <div className="details-hero-overlay" />

        {/* Breadcrumb Navigation */}
        <div className="container details-breadcrumb-container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="breadcrumb-back-btn"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/explore" className="breadcrumb-link">Explore</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current" aria-current="page">{movie.title}</span>
          </nav>
        </div>

        {/* Details Hero Grid */}
        <div className="container details-hero-content">
          <div className="details-poster-box">
            <img
              src={getImageUrl(movie.posterPath, 'w500')}
              alt={`Official poster of ${movie.title}`}
              className="details-poster-img"
            />
          </div>

          <div className="details-info-box">
            <div className="details-title-row">
              <h1 className="details-title">{movie.title}</h1>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <span className="details-original-title">
                  ({movie.originalTitle})
                </span>
              )}
            </div>

            {movie.tagline && (
              <p className="details-tagline">“{movie.tagline}”</p>
            )}

            {/* Metadata Badges */}
            <div className="details-meta-bar">
              <RatingBadge rating={movie.rating} size="lg" />
              <div className="meta-item">
                <Calendar size={16} className="text-muted" />
                <span>{getReleaseYear(movie.releaseDate)}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} className="text-muted" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              {movie.originalLanguage && (
                <div className="meta-item">
                  <Globe size={16} className="text-muted" />
                  <span>{movie.originalLanguage.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="details-genres-list">
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map(g => (
                  <Link key={g.id} to={`/explore?genre=${g.id}`}>
                    <GenreChip genre={g.name} clickable />
                  </Link>
                ))
              ) : (
                <GenreChip genre="Cinema" />
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="details-actions-row">
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="btn btn-primary"
              >
                <Play size={18} />
                <span>Watch Trailer</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWatchlist(movie)}
                className={`btn btn-secondary ${inWatchlist ? 'btn-active' : ''}`}
                aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark size={18} fill={inWatchlist ? 'currentColor' : 'none'} />
                <span>{inWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleFavourite(movie)}
                className={`btn btn-secondary ${inFavourites ? 'btn-active' : ''}`}
                aria-label={inFavourites ? 'Remove from Favourites' : 'Add to Favourites'}
              >
                <Heart size={18} fill={inFavourites ? 'currentColor' : 'none'} />
                <span>{inFavourites ? 'In Favourites' : 'Favourite'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="btn-icon"
                title="Share Movie Link"
                aria-label="Share movie link"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Overview */}
            <div className="details-synopsis-section">
              <h3 className="synopsis-heading">Overview</h3>
              <p className="synopsis-text">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CAST & CREW SECTION */}
      {cast && cast.length > 0 && (
        <section className="container details-cast-section" aria-label="Cast and performers">
          <h2 className="section-title">Top Cast</h2>
          <div className="cast-grid">
            {cast.slice(0, 8).map(member => (
              <div key={member.id} className="cast-card">
                <div className="cast-photo-box">
                  <img
                    src={getProfileUrl(member.profilePath)}
                    alt={member.name}
                    className="cast-photo"
                    loading="lazy"
                  />
                </div>
                <div className="cast-info">
                  <span className="cast-name">{member.name}</span>
                  <span className="cast-character">{member.character}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. FINANCIALS / FACT SHEET */}
      <section className="container details-facts-section">
        <div className="facts-card">
          <div className="fact-item">
            <span className="fact-label">Release Date</span>
            <span className="fact-value">{formatDate(movie.releaseDate)}</span>
          </div>
          <div className="fact-item">
            <span className="fact-label">Status</span>
            <span className="fact-value">{movie.status || 'Released'}</span>
          </div>
          <div className="fact-item">
            <span className="fact-label">Budget</span>
            <span className="fact-value">{formatCurrency(movie.budget)}</span>
          </div>
          <div className="fact-item">
            <span className="fact-label">Box Office Revenue</span>
            <span className="fact-value">{formatCurrency(movie.revenue)}</span>
          </div>
        </div>
      </section>

      {/* 4. SIMILAR MOVIES CAROUSEL */}
      {similar && similar.length > 0 && (
        <div className="container details-similar-section">
          <MovieCarousel
            title="More Like This"
            subtitle="Explore titles sharing similar themes, creators, or genres"
            movies={similar}
          />
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerKey={trailerKey}
        movieTitle={movie.title}
      />
    </article>
  );
}
