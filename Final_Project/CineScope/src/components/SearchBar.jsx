import React, { useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  onSearch,
  loading = false,
  placeholder = 'Search movies by title, actor, or keyword...',
  autoFocus = false
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form className="search-bar-wrapper" onSubmit={handleSubmit} role="search">
      <div className="search-icon-box">
        {loading ? (
          <Loader2 size={20} className="search-spinner animate-spin" />
        ) : (
          <Search size={20} className="search-icon" />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="search-input"
        aria-label="Search movies"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="search-clear-btn"
          aria-label="Clear search text"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
