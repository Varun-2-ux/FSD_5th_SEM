import React from 'react';

export default function GenreChip({
  genre,
  active = false,
  clickable = false,
  onClick,
  size = 'md'
}) {
  const Component = clickable ? 'button' : 'span';
  const name = typeof genre === 'string' ? genre : genre?.name || 'Genre';

  return (
    <Component
      type={clickable ? 'button' : undefined}
      className={`genre-chip ${active ? 'active' : ''} ${clickable ? 'clickable' : ''} ${size === 'sm' ? 'chip-sm' : ''}`}
      onClick={clickable ? onClick : undefined}
      aria-pressed={clickable ? active : undefined}
    >
      {name}
    </Component>
  );
}
