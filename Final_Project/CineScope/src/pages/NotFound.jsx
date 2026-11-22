import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="container not-found-content">
        <div className="not-found-film-strip">
          <Film size={64} className="film-icon animate-pulse" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Scene Not Found</h2>
        <p className="not-found-desc">
          Looks like this reel was cut from the final film or the URL doesn't exist.
          Let's get you back to the main stage.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link to="/explore" className="btn btn-secondary">
            <Compass size={18} />
            <span>Explore Movies</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
