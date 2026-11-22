import React from 'react';
import { Film, Github, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Film size={22} className="logo-film-icon" />
              <span className="brand-title">Cine<span className="brand-accent">Scope</span></span>
            </div>
            <p className="footer-desc">
              A cinematic movie discovery web application crafted for film lovers to explore,
              search, filter, and track their favorite motion pictures with ease.
            </p>
            <div className="footer-credits">
              <span>Built with React 18, Vite & CSS3</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Discover (Home)</Link></li>
              <li><Link to="/explore">Explore & Search</Link></li>
              <li><Link to="/watchlist">My Watchlist</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Popular Genres</h4>
            <ul className="footer-links">
              <li><Link to="/explore?genre=878">Sci-Fi Movies</Link></li>
              <li><Link to="/explore?genre=28">Action Thrillers</Link></li>
              <li><Link to="/explore?genre=18">Drama & Stories</Link></li>
              <li><Link to="/explore?genre=16">Animation & Family</Link></li>
            </ul>
          </div>

          {/* API Attribution */}
          <div className="footer-col attribution-col">
            <h4 className="footer-heading">Data Source & Attribution</h4>
            <div className="tmdb-attribution-box">
              <div className="tmdb-logo-pill">
                <span className="tmdb-tag">TMDB</span>
              </div>
              <p className="tmdb-disclaimer">
                This product uses the TMDB API but is not endorsed or certified by TMDB. All movie metadata,
                posters, and images are powered by The Movie Database community.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} CineScope — Final Year FSD Project. Crafted with precision for Academic Submission.
          </p>
          <div className="footer-status-pill">
            <span className="status-dot"></span>
            <span>All Systems Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
