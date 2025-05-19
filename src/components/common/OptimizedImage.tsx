import React, { useState, useRef, useEffect, ImgHTMLAttributes, useMemo } from 'react';
import Spinner from '../ui/Spinner'; // Import the Spinner component
import logger from '../../utils/logger'; // Added logger import

// Read Base URL from environment variable
const ASSET_BASE_URL = import.meta.env.VITE_APP_ASSET_URL || ''; // Provide empty string fallback
// if (!ASSET_BASE_URL && import.meta.env.DEV) {
//   // console.warn('VITE_APP_ASSET_URL environment variable is not set. Relative image paths may not work correctly.'); // Removed
// }

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string; // Expecting relative path from backend or potentially absolute URL
  alt: string;
  placeholderSrc?: string; // Optional low-quality placeholder
  className?: string; // Class for the <img> tag itself
  containerClassName?: string; // Class for the container div
  observerOptions?: IntersectionObserverInit; // Allow customization of observer
}

/**
 * OptimizedImage Component
 * Implements lazy loading for images using the Intersection Observer API.
 * Shows an optional placeholder while the main image is loading.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  containerClassName = '', // Add containerClassName prop
  observerOptions = { rootMargin: '0px 0px 200px 0px' }, // Load 200px before entering viewport
  ...rest
}) => {
  // Log the received src prop on every render
  // --- Construct the full image URL ---
  const fullImageUrl = useMemo(() => {
    if (!src) return placeholderSrc || ''; // Return placeholder or empty if no src
    // Check if src is already an absolute URL
    if (/^https?|^\/\//i.test(src)) {
      return src;
    }
    // If ASSET_BASE_URL is missing, return the relative src and hope for the best
    if (!ASSET_BASE_URL) {
      return src;
    }
    // Use URL constructor for robust joining
    try {
      // Ensure base URL ends with a slash if src doesn't start with one
      const formattedBase = ASSET_BASE_URL.endsWith('/') ? ASSET_BASE_URL : `${ASSET_BASE_URL}/`;
      // Remove leading slash from src if base already has one
      const formattedSrc = src.startsWith('/') ? src.substring(1) : src;
      return new URL(formattedSrc, formattedBase).toString();
    } catch (_error) {
      // console.error(`Error constructing image URL with base '${ASSET_BASE_URL}' and src '${src}':`, error); // Removed
      logger.error(`Error constructing image URL with base '${ASSET_BASE_URL}' and src '${src}':`, _error); // Use logger
      return src; // Fallback to original src on construction error
    }
  }, [src, placeholderSrc]);

  // --- State Management ---
  // Initialize with placeholder if available
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholderSrc);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading initially
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    const currentImgRef = imgRef.current;

    if (currentImgRef) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Only trigger load if intersecting AND the target image isn't already loaded or loading
          if (entry.isIntersecting && imageSrc !== fullImageUrl) {
            setIsLoading(true); // Start loading
            setHasError(false);
            setImageSrc(fullImageUrl);
            observer.unobserve(currentImgRef);
          }
        });
      }, observerOptions);

      observer.observe(currentImgRef);
    }

    return () => {
      if (observer && currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
    // Use fullImageUrl in dependency array
  }, [fullImageUrl, observerOptions, imageSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // --- Rendering ---
  // Always apply layout classes to the image itself to fill its container
  const hasExplicitSizing = /w-|h-/.test(className); // Check if className prop has w- or h-

  const imgClassName = [
    'transition-opacity duration-300', // Opacity transition
    !hasExplicitSizing ? 'absolute inset-0 w-full h-full object-cover' : '', // Conditional fill
    // --- Simplified Opacity ---
    isLoading ? 'opacity-0' : 'opacity-100', // Hidden while loading, visible otherwise
    // -------------------------
    hasError ? 'border-2 border-red-500' : '', // Error state
    className, // Add any EXTRA classes passed via props
  ]
    .filter(Boolean)
    .join(' ');

  // Use the passed containerClassName prop for the container div
  // Restore overflow-hidden (it wasn't the visibility issue)
  const finalContainerClassName = containerClassName
    ? [containerClassName, 'overflow-hidden'].filter(Boolean).join(' ')
    : 'relative overflow-hidden';

  return (
    // Restore the wrapping div
    <div className={finalContainerClassName} style={rest.style}>
      {/* Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-200 dark:bg-gray-700 bg-opacity-50 z-10">
          <Spinner size="h-5 w-5" />
        </div>
      )}
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        crossOrigin="anonymous"
        // Use the original imgClassName with hardcoded layout
        className={imgClassName}
        // No style here, handled by rest below
        onLoad={handleLoad}
        onError={handleError}
        // style={{ border: '10px solid red', width: '300px', height: '300px', position: 'fixed', top: '100px', left: '100px', zIndex: 9999, backgroundColor: 'yellow', objectFit: 'contain' }}
        {...rest} // Spread rest props here
      />
    </div>
  );
};

OptimizedImage.displayName = 'OptimizedImage';
