const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

/**
 * Build a full TMDB image URL from an image path and size.
 * If the path already starts with http/https or is missing, handle gracefully.
 *
 * @param {string|null} path - Relative image path (e.g. "/qJ2tW6WMUDux911r6m7haRef0WH.jpg") or absolute URL
 * @param {string} size - TMDB size: 'w342', 'w500', 'w780', 'w1280', 'original'
 * @param {string} title - Optional title used for placeholder fallback
 * @returns {string} Full image URL or fallback placeholder
 */
export const getImageUrl = (path, size = 'w500', title = 'Cinema') => {
  if (!path) {
    return createPosterFallback(title);
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Ensure leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE}${size}${cleanPath}`;
};

/**
 * Returns a high-res backdrop URL or fallback
 */
export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE}${size}${cleanPath}`;
};

/**
 * Profile avatar URL for actors/crew
 */
export const getProfileUrl = (path, size = 'w185') => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=185&auto=format&fit=crop&q=80';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE}${size}${cleanPath}`;
};

/**
 * Generates an elegant SVG placeholder data URL for missing posters
 */
export const createPosterFallback = (title = 'Movie Title') => {
  const safeTitle = (title || 'Film').replace(/[<>&'"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="#131B2E">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
    </defs>
    <rect width="500" height="750" fill="url(#g)"/>
    <circle cx="250" cy="300" r="55" fill="#312e81" opacity="0.6"/>
    <path d="M225 280 L285 300 L225 320 Z" fill="#6366f1"/>
    <text x="250" y="410" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#f8fafc" text-anchor="middle">${safeTitle.slice(0, 22)}</text>
    <text x="250" y="445" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#818cf8" text-anchor="middle">CineScope Cinema</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
