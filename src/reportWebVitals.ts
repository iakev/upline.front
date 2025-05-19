import { ReportCallback } from 'web-vitals';
import logger from './utils/logger';

/**
 * Reports web vitals metrics to the console.
 * Optionally accepts a callback function to handle the metric entries.
 *
 * @param onPerfEntry - The callback function to handle the performance metric entries.
 */
const reportWebVitals = (onPerfEntry?: ReportCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        // Pass the generic ReportCallback directly
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      })
      .catch((err) => {
        // Handle potential errors during dynamic import
        logger.error('Error loading web-vitals:', err);
      });
  }
};

// Use named export for clarity and potential future additions
export { reportWebVitals };
