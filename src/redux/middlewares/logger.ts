import { Middleware, MiddlewareAPI, Dispatch } from 'redux';

const logger = (store: MiddlewareAPI<Dispatch<any>, any>) => (next: Dispatch<any>) => (action: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  }

  return next(action);
};

export default logger as Middleware;
