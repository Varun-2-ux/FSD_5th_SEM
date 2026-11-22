import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Heart, Info } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl, createPosterFallback } from '../utils/imageUrl';
import { getReleaseYear } from '../utils/formatDate';
import RatingBadge from './RatingBadge';

export default function MovieCard({
  movie,
  showRemove = false,
  onRemove,
  priority = false
}) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist, isFavourite, toggleFavourite } = useWatchlist();
  const [imageError, setImageError] = useState(false);

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);
  const inFavourites = isFavourite(movie.id);
  const releaseYear = getReleaseYear(movie.releaseDate);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (showRemove && onRemove) {
      onRemove(movie.id, movie.title);
    } else {
      toggleWatchlist(movie);
    }
  };

  const handleFavouriteClick = (e) => {
    e.stopPropagation();
    toggleFavourite(movie);
  };

  const posterSrc = imageError
    ? createPosterFallback(movie.title)
    : getImageUrl(movie.posterPath, 'w500', movie.title);

  return (
    <article
      className="movie-card"
      tabIndex={0}
      role="button"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`${movie.title}, released ${releaseYear}, rated ${movie.rating} stars`}
    >
      <div className="card-poster-wrapper">
        <img
          src={posterSrc}
          alt={`Poster of ${movie.title}`}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setImageError(true)}
          className="card-poster"
        />

        {/* Rating badge on top right */}
        <div className="card-badge-container">
          <RatingBadge rating={movie.rating} size="sm" />
        </div>

        {/* Quick action buttons overlay */}
        <div className="card-quick-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`card-action-btn ${inWatchlist ? 'active-watchlist' : ''}`}
            onClick={handleWatchlistClick}
            aria-label={
              showRemove
                ? `Remove ${movie.title} from Watchlist`
                : inWatchlist
                ? `Remove ${movie.title} from Watchlist`
                : `Add ${movie.title} to Watchlist`
            }
            title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark size={16} fill={inWatchlist ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            className={`card-action-btn ${inFavourites ? 'active-favourite' : ''}`}
            onClick={handleFavouriteClick}
            aria-label={
              inFavourites
                ? `Remove ${movie.title} from Favourites`
                : `Add ${movie.title} to Favourites`
            }
            title={inFavourites ? 'In Favourites' : 'Add to Favourites'}
          >
            <Heart size={16} fill={inFavourites ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Synopsis overlay reveal on hover for desktop */}
        <div className="card-hover-overlay">
          <div className="card-synopsis">
            <p>{movie.overview ? movie.overview.slice(0, 110) + '...' : 'Click to explore complete movie details, cast, and trailers.'}</p>
          </div>
          <span className="card-details-prompt">
            <Info size={14} /> View Details
          </span>
        </div>
      </div>

      <div className="card-meta">
        <h4 className="card-title" title={movie.title}>
          {movie.title}
        </h4>
        <div className="card-sub-info">
          <span className="card-year">{releaseYear}</span>
          {movie.originalLanguage && (
            <span className="card-lang">{movie.originalLanguage.toUpperCase()}</span>
          )}
        </div>
      </div>
    </article>
  );
}
