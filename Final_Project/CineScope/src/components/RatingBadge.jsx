import React from 'react';
import { Star } from 'lucide-react';
import { formatRating } from '../utils/formatDate';

export default function RatingBadge({ rating, size = 'md', showStar = true }) {
  const formatted = formatRating(rating);
  const num = Number(rating) || 0;

  // Determine color scheme
  let colorClass = 'rating-mid';
  if (num >= 7.5) {
    colorClass = 'rating-high';
  } else if (num < 6.0 && num > 0) {
    colorClass = 'rating-low';
  }

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  };

  return (
    <div
      className={`rating-badge ${colorClass} ${sizeClasses[size] || 'badge-md'}`}
      aria-label={`Rating: ${formatted} out of 10`}
    >
      {showStar && <Star className="star-icon" size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} fill="currentColor" />}
      <span className="rating-value">{formatted}</span>
    </div>
  );
}
