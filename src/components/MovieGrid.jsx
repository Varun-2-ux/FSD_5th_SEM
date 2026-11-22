import React from 'react';
import MovieCard from './MovieCard';
import { MovieGridSkeleton } from './LoadingSkeleton';
import EmptyState from './EmptyState';

export default function MovieGrid({
  movies = [],
  loading = false,
  emptyType = 'search',
  emptyTitle,
  emptyMessage,
  onReset,
  showRemove = false,
  onRemove
}) {
  if (loading) {
    return <MovieGridSkeleton count={10} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        title={emptyTitle}
        message={emptyMessage}
        actionText={onReset ? 'Reset Filters' : undefined}
        onAction={onReset}
      />
    );
  }

  return (
    <div className="movie-grid" role="region" aria-label="Movies Collection">
      {movies.map((movie, index) => (
        <MovieCard
          key={`${movie.id}-${index}`}
          movie={movie}
          priority={index < 4}
          showRemove={showRemove}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
