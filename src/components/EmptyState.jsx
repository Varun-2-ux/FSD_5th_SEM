import React from 'react';
import { Film, Search, Bookmark, AlertCircle, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  type = 'search',
  title,
  message,
  actionText,
  actionLink,
  onAction,
  icon: CustomIcon
}) {
  const getIcon = () => {
    if (CustomIcon) return <CustomIcon size={48} className="empty-state-icon" />;
    switch (type) {
      case 'watchlist':
        return <Bookmark size={48} className="empty-state-icon text-accent" />;
      case 'error':
        return <AlertCircle size={48} className="empty-state-icon text-error" />;
      case 'movie':
        return <Film size={48} className="empty-state-icon" />;
      case 'search':
      default:
        return <Search size={48} className="empty-state-icon text-muted" />;
    }
  };

  const defaultTitles = {
    search: 'No Movies Found',
    watchlist: 'Your Watchlist is Empty',
    favourites: 'No Favourites Saved Yet',
    error: 'Something went wrong',
    movie: 'No Titles Available'
  };

  const defaultMessages = {
    search: 'We couldn’t find any matches. Try adjusting your search query or removing active filters.',
    watchlist: 'Explore movies and click the bookmark icon to save titles you want to watch later.',
    favourites: 'Click the heart icon on any movie to curate your personal hall of fame.',
    error: 'Unable to load content. Please check your connection or retry.',
    movie: 'There are currently no movies to display in this section.'
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon-wrapper">
        {getIcon()}
      </div>
      <h3 className="empty-state-title">{title || defaultTitles[type] || 'No Content Found'}</h3>
      <p className="empty-state-message">{message || defaultMessages[type]}</p>

      {(actionText && (actionLink || onAction)) && (
        <div className="empty-state-actions">
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary">
              {actionText}
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn btn-primary">
              <RotateCcw size={16} />
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
