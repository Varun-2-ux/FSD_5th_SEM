import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Play } from 'lucide-react';

export default function TrailerModal({
  isOpen,
  onClose,
  trailerKey,
  movieTitle
}) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Trap focus and support Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Official Trailer: ${movieTitle}`}
    >
      <div
        className="modal-container"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <Play size={18} className="text-accent" />
            <h3 className="modal-title">{movieTitle} — Official Trailer</h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close trailer modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-video-wrapper">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            />
          ) : (
            <div className="trailer-fallback">
              <p>No video player embed is currently available for this title.</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' official trailer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <ExternalLink size={16} />
                Search Trailer on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
