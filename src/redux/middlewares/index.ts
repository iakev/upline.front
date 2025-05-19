import logger from './logger';
import apiSlice from '../api/apiSlice';

const middlewares = [apiSlice.middleware, logger];
if (process.env.NODE_ENV !== 'development') {
  middlewares.push(logger);
}

export default middlewares;
