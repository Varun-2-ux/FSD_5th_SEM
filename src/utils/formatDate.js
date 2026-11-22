/**
 * Format a date string (e.g. "2023-10-26") into a readable format (e.g. "Oct 26, 2023")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Extract 4-digit release year from date string
 */
export const getReleaseYear = (dateString) => {
  if (!dateString) return 'N/A';
  return dateString.slice(0, 4) || 'N/A';
};

/**
 * Format runtime in minutes to "Xh Ym"
 */
export const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format vote rating to 1 decimal place (e.g. 8.4)
 */
export const formatRating = (rating) => {
  if (rating === undefined || rating === null) return 'NR';
  const num = Number(rating);
  return isNaN(num) ? 'NR' : num.toFixed(1);
};

/**
 * Format number into compact k/m format (e.g. 14200 -> 14.2k)
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};

/**
 * Format currency amount into USD currency string
 */
export const formatCurrency = (amount) => {
  if (!amount || amount <= 0) return 'Not disclosed';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};
