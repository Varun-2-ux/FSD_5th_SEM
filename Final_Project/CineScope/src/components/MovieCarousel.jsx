import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { MovieCarouselSkeleton } from './LoadingSkeleton';

export default function MovieCarousel({
  title,
  subtitle,
  movies = [],
  loading = false,
  badge
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 350);
  };

  if (loading) {
    return (
      <section className="carousel-section">
        <div className="carousel-header">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        </div>
        <MovieCarouselSkeleton count={6} />
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section className="carousel-section" aria-label={title}>
      <div className="carousel-header">
        <div className="carousel-title-group">
          {badge && <span className="carousel-badge">{badge}</span>}
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${title} carousel left`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={`Scroll ${title} carousel right`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className="carousel-container"
        ref={scrollContainerRef}
        onScroll={checkScroll}
        tabIndex={0}
        role="region"
        aria-label={`${title} scrollable movie row`}
      >
        {movies.map((movie, index) => (
          <div key={`${movie.id}-${index}`} className="carousel-item">
            <MovieCard movie={movie} priority={index < 3} />
          </div>
        ))}
      </div>
    </section>
  );
}
