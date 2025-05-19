import logger from './logger';

const storageHelper = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      logger.error(`Error getting item ${key} from localStorage`, error);
      return null;
    }
  },

  set: (key: string, value: any): void => {
    try {
      const item = JSON.stringify(value);
      localStorage.setItem(key, item);
    } catch (error) {
      logger.error(`Error setting item ${key} in localStorage`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error(`Error removing item ${key} from localStorage`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error(`Error clearing localStorage`, error);
    }
  },
};

export default storageHelper;
