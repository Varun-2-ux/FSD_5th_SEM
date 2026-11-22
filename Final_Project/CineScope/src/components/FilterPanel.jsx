import React, { useState } from 'react';
import { Filter, RotateCcw, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_GENRES } from '../services/mockData';

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  genres = MOCK_GENRES,
  totalResults
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const years = [
    { label: 'All Years', value: '' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2010s', value: '2014' },
    { label: '2000s', value: '2008' },
    { label: '1990s', value: '1993' }
  ];

  const languages = [
    { label: 'All Languages', value: '' },
    { label: 'English (EN)', value: 'en' },
    { label: 'Hindi (HI)', value: 'hi' },
    { label: 'Korean (KO)', value: 'ko' },
    { label: 'Japanese (JA) / Anime', value: 'ja' },
    { label: 'Spanish (ES)', value: 'es' },
    { label: 'French (FR)', value: 'fr' }
  ];

  const ratings = [
    { label: 'Any Rating', value: '' },
    { label: '⭐ 8.0+ Masterpiece', value: '8' },
    { label: '⭐ 7.0+ Recommended', value: '7' },
    { label: '⭐ 6.0+ Good', value: '6' }
  ];

  const sortOptions = [
    { label: 'Most Popular', value: 'popularity.desc' },
    { label: 'Highest Rated', value: 'vote_average.desc' },
    { label: 'Newest Release', value: 'primary_release_date.desc' },
    { label: 'Oldest Release', value: 'primary_release_date.asc' },
    { label: 'Title (A - Z)', value: 'title.asc' }
  ];

  const handleFieldChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const removeFilter = (key) => {
    onChange({ ...filters, [key]: '' });
  };

  // Check if any filter is active
  const hasActiveFilters =
    Boolean(filters.genreId) ||
    Boolean(filters.year) ||
    Boolean(filters.language) ||
    Boolean(filters.minRating);

  // Active filter chip labels
  const activeChips = [];
  if (filters.genreId) {
    const matchedGenre = genres.find(g => String(g.id) === String(filters.genreId));
    activeChips.push({
      key: 'genreId',
      label: `Genre: ${matchedGenre ? matchedGenre.name : filters.genreId}`
    });
  }
  if (filters.year) {
    activeChips.push({
      key: 'year',
      label: `Year: ${filters.year}`
    });
  }
  if (filters.minRating) {
    activeChips.push({
      key: 'minRating',
      label: `Rating: ≥ ${filters.minRating}★`
    });
  }
  if (filters.language) {
    const langObj = languages.find(l => l.value === filters.language);
    activeChips.push({
      key: 'language',
      label: `Language: ${langObj ? langObj.label : filters.language}`
    });
  }

  return (
    <aside className="filter-panel" aria-label="Movie filters and sorting">
      {/* Mobile Accordion Toggle */}
      <div className="filter-mobile-bar">
        <button
          type="button"
          onClick={() => setIsMobileOpen(prev => !prev)}
          className="btn btn-secondary filter-mobile-toggle"
          aria-expanded={isMobileOpen}
        >
          <SlidersHorizontal size={18} />
          <span>Filters & Sorting {hasActiveFilters && `(${activeChips.length})`}</span>
          {isMobileOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-ghost filter-reset-btn"
            title="Reset all filters"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className={`filter-content-container ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="filter-controls-grid">
          {/* Genre select */}
          <div className="filter-group">
            <label htmlFor="filter-genre" className="filter-label">
              Genre
            </label>
            <select
              id="filter-genre"
              value={filters.genreId || ''}
              onChange={(e) => handleFieldChange('genreId', e.target.value)}
              className="filter-select"
            >
              <option value="">All Genres</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Release Year */}
          <div className="filter-group">
            <label htmlFor="filter-year" className="filter-label">
              Release Year
            </label>
            <select
              id="filter-year"
              value={filters.year || ''}
              onChange={(e) => handleFieldChange('year', e.target.value)}
              className="filter-select"
            >
              {years.map(y => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Rating */}
          <div className="filter-group">
            <label htmlFor="filter-rating" className="filter-label">
              Minimum Rating
            </label>
            <select
              id="filter-rating"
              value={filters.minRating || ''}
              onChange={(e) => handleFieldChange('minRating', e.target.value)}
              className="filter-select"
            >
              {ratings.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="filter-group">
            <label htmlFor="filter-language" className="filter-label">
              Language
            </label>
            <select
              id="filter-language"
              value={filters.language || ''}
              onChange={(e) => handleFieldChange('language', e.target.value)}
              className="filter-select"
            >
              {languages.map(l => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label htmlFor="filter-sort" className="filter-label">
              Sort By
            </label>
            <select
              id="filter-sort"
              value={filters.sortBy || 'popularity.desc'}
              onChange={(e) => handleFieldChange('sortBy', e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="active-chips-row">
            <span className="active-chips-label">Active Filters:</span>
            <div className="active-chips-list">
              {activeChips.map(chip => (
                <button
                  key={chip.key}
                  type="button"
                  className="active-chip"
                  onClick={() => removeFilter(chip.key)}
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <span>{chip.label}</span>
                  <X size={14} className="chip-remove-icon" />
                </button>
              ))}
              <button
                type="button"
                className="chip-reset-all"
                onClick={onReset}
              >
                Reset All
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
