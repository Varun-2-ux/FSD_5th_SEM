import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="movie-card skeleton-card">
      <div className="skeleton-poster skeleton-shimmer" />
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title skeleton-shimmer" />
        <div className="skeleton-meta">
          <div className="skeleton-line skeleton-badge skeleton-shimmer" />
          <div className="skeleton-line skeleton-year skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MovieCarouselSkeleton({ count = 5 }) {
  return (
    <div className="carousel-skeleton-wrapper">
      <div className="carousel-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="carousel-skeleton-item">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="hero-banner skeleton-hero skeleton-shimmer">
      <div className="container hero-content">
        <div className="skeleton-line skeleton-hero-badge" />
        <div className="skeleton-line skeleton-hero-title" />
        <div className="skeleton-line skeleton-hero-desc" />
        <div className="skeleton-line skeleton-hero-desc short" />
        <div className="skeleton-hero-actions">
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="details-skeleton">
      <div className="details-hero-skeleton skeleton-shimmer" />
      <div className="container details-content-skeleton">
        <div className="details-poster-skeleton skeleton-shimmer" />
        <div className="details-meta-skeleton">
          <div className="skeleton-line skeleton-hero-title" />
          <div className="skeleton-line skeleton-hero-desc" />
          <div className="skeleton-line skeleton-hero-desc short" />
        </div>
      </div>
    </div>
  );
}
