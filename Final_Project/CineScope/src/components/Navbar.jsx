import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Film, Compass, Bookmark, Search, Sun, Moon, Menu, X, Sparkles, Key, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getApiKey, setCustomApiKey, searchMovies } from '../services/movieApi';
import { getImageUrl } from '../utils/imageUrl';
import { getReleaseYear, formatRating } from '../utils/formatDate';

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { watchlist } = useWatchlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Live Navbar Quick Search State
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [navSearchResults, setNavSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu and search dropdown on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    setNavSearchQuery('');
  }, [location.pathname]);

  // Track window scroll for blur & shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for live navbar dropdown
  useEffect(() => {
    if (!navSearchQuery.trim()) {
      setNavSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await searchMovies(navSearchQuery, 1);
        setNavSearchResults(data?.results?.slice(0, 5) || []);
      } catch {
        setNavSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [navSearchQuery]);

  const totalSaved = watchlist.length;

  const handleOpenApiKeyModal = () => {
    setApiKeyInput(getApiKey());
    setApiKeyModalOpen(true);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setCustomApiKey(apiKeyInput);
    setApiKeyModalOpen(false);
    window.location.reload();
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/explore?q=${encodeURIComponent(navSearchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Brand Logo */}
          <NavLink to="/" className="brand-logo" aria-label="CineScope Home">
            <div className="logo-icon-box">
              <Film size={22} className="logo-film-icon" />
            </div>
            <div className="logo-text-group">
              <span className="brand-title">Cine<span className="brand-accent">Scope</span></span>
              <span className="brand-badge">PRO</span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              <span>Discover</span>
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Compass size={16} />
              <span>Explore</span>
            </NavLink>

            <NavLink
              to="/watchlist"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Bookmark size={16} />
              <span>Watchlist</span>
              {totalSaved > 0 && (
                <span className="nav-count-badge" aria-label={`${totalSaved} saved movies`}>
                  {totalSaved}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Right Controls: Live Search, Key Config, Theme Toggle, Mobile Menu Toggle */}
          <div className="navbar-actions">
            {/* Live Search Bar with Dropdown */}
            <div className="navbar-search-wrapper" ref={searchBoxRef}>
              <form onSubmit={handleNavSearchSubmit} className="navbar-search-form">
                <Search size={16} className="nav-search-icon" />
                <input
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => {
                    setNavSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search movies, actors..."
                  className="navbar-search-input"
                  aria-label="Search movies"
                />
                {navSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setNavSearchQuery('');
                      setNavSearchResults([]);
                    }}
                    className="nav-search-clear"
                    aria-label="Clear search input"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Live Search Results Dropdown */}
              {isSearchOpen && navSearchQuery.trim().length > 0 && (
                <div className="nav-search-dropdown" role="listbox">
                  {navSearchResults.length > 0 ? (
                    <>
                      <div className="nav-dropdown-header">
                        <span>Matching Movies ({navSearchResults.length})</span>
                      </div>
                      {navSearchResults.map((movie) => (
                        <div
                          key={movie.id}
                          className="nav-search-item"
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate(`/movie/${movie.id}`);
                          }}
                          role="option"
                          aria-selected="false"
                        >
                          <img
                            src={getImageUrl(movie.posterPath, 'w185', movie.title)}
                            alt=""
                            className="nav-item-thumb"
                          />
                          <div className="nav-item-info">
                            <span className="nav-item-title">{movie.title}</span>
                            <div className="nav-item-meta">
                              <span>{getReleaseYear(movie.releaseDate)}</span>
                              <span className="nav-item-dot">•</span>
                              <span className="nav-item-rating">
                                <Star size={11} fill="currentColor" /> {formatRating(movie.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleNavSearchSubmit}
                        className="nav-view-all-btn"
                      >
                        View all results for "{navSearchQuery}" →
                      </button>
                    </>
                  ) : (
                    <div className="nav-search-empty">
                      <span>No results for "{navSearchQuery}"</span>
                      <button
                        type="button"
                        onClick={handleNavSearchSubmit}
                        className="nav-empty-link"
                      >
                        Search anyway in Explore
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenApiKeyModal}
              className="btn-icon"
              title="TMDB API Configuration"
              aria-label="TMDB API Configuration"
            >
              <Key size={18} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn-icon theme-toggle-btn"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun size={19} className="theme-icon sun" /> : <Moon size={19} className="theme-icon moon" />}
            </button>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
          <div className="mobile-search-box-container">
            <form onSubmit={handleNavSearchSubmit} className="mobile-search-form">
              <Search size={16} className="nav-search-icon" />
              <input
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-go-btn">Go</button>
            </form>
          </div>

          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={18} />
              <span>Discover</span>
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={18} />
              <span>Explore & Search</span>
            </NavLink>

            <NavLink
              to="/watchlist"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bookmark size={18} />
              <span>My Watchlist</span>
              {totalSaved > 0 && (
                <span className="mobile-count-badge">{totalSaved}</span>
              )}
            </NavLink>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenApiKeyModal();
              }}
              className="mobile-nav-link"
            >
              <Key size={18} />
              <span>TMDB API Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setApiKeyModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="api-modal-title"
        >
          <div className="modal-container api-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="api-modal-title" className="modal-title">TMDB API Configuration</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setApiKeyModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveApiKey} className="api-modal-body">
              <p className="api-modal-desc">
                Enter your free <strong>TMDB v3 API Key</strong> to fetch live titles directly from The Movie Database.
                Leave blank to use CineScope's comprehensive built-in offline dataset!
              </p>
              <div className="api-input-group">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="e.g. 3a8f9024f0c7e2..."
                  className="filter-select api-key-field"
                  autoFocus
                />
              </div>
              <div className="api-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setApiKeyInput('');
                    setCustomApiKey('');
                    setApiKeyModalOpen(false);
                    window.location.reload();
                  }}
                  className="btn btn-secondary"
                >
                  Use Mock Data
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Key & Reload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
