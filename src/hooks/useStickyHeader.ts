import { useState, useEffect } from 'react';

/**
 * Custom hook to track if the header should be sticky based on scroll position.
 * @param threshold - The scroll distance (in pixels) after which the header becomes sticky. Defaults to 0.
 * @returns boolean - True if the page has scrolled past the threshold, false otherwise.
 */
export const useStickyHeader = (threshold: number = 0): boolean => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let lastKnownScrollPosition = 0;
    let ticking = false;

    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(lastKnownScrollPosition > threshold);
          ticking = false;
        });

        ticking = true;
      }
    };

    // Initial check in case the page loads already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]); // Re-run effect if threshold changes

  return isSticky;
};
