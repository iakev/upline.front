import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions extends IntersectionObserverInit {
  triggerOnce?: boolean; // Whether the animation should only trigger once
}

/**
 * Custom hook to detect when an element is visible in the viewport.
 * Uses IntersectionObserver for performance.
 *
 * @param options - Configuration options for the IntersectionObserver.
 * @returns A tuple containing:
 *   - ref: A RefObject to attach to the target element.
 *   - isVisible: A boolean indicating if the element is currently intersecting the viewport.
 */
export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = { threshold: 0.1, triggerOnce: true },
): [RefObject<T>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      // If entry is intersecting
      if (entry.isIntersecting) {
        setIsVisible(true);
        // If triggerOnce is true, unobserve after the first intersection
        if (options.triggerOnce) {
          observer.unobserve(element);
        }
      } else {
        // If triggerOnce is false, set visibility to false when not intersecting
        if (!options.triggerOnce) {
          setIsVisible(false);
        }
      }
    }, options);

    observer.observe(element);

    // Cleanup observer on component unmount
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
    // Re-run effect if options object reference changes (be careful with inline objects)
    // Consider using useMemo for options if passed dynamically
  }, [options]);

  return [elementRef, isVisible];
}
