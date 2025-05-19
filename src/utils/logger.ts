const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Set the current log level (e.g., from an environment variable)
// Default to INFO for production, DEBUG for development
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

const canLog = (level: number): boolean => {
  return level >= CURRENT_LOG_LEVEL;
};

const timestamp = (): string => new Date().toISOString();

const logger = {
  debug: (...args: any[]): void => {
    if (canLog(LOG_LEVELS.DEBUG)) {
      console.debug(`[DEBUG] [${timestamp()}]`, ...args);
    }
  },
  info: (...args: any[]): void => {
    if (canLog(LOG_LEVELS.INFO)) {
      console.info(`[INFO] [${timestamp()}]`, ...args);
    }
  },
  warn: (...args: any[]): void => {
    if (canLog(LOG_LEVELS.WARN)) {
      console.warn(`[WARN] [${timestamp()}]`, ...args);
    }
  },
  error: (...args: any[]): void => {
    if (canLog(LOG_LEVELS.ERROR)) {
      console.error(`[ERROR] [${timestamp()}]`, ...args);
    }
  },
};

export default logger;
