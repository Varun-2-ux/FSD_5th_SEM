import React, { useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useWatchlist();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon text-success" />,
    error: <AlertCircle size={18} className="toast-icon text-error" />,
    info: <Info size={18} className="toast-icon text-info" />
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-notification toast-${toast.type || 'info'}`}
    >
      <div className="toast-content">
        {icons[toast.type] || icons.info}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={hideToast}
        className="toast-close"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
