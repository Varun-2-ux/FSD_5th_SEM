import { useState, useEffect } from 'react';

/**
 * Hook to debounce any fast-changing value (e.g. search input).
 * Reduces API/filtering load while user is actively typing.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default 400ms)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
