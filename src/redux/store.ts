import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import middlewares from './middlewares';
import appReducer from '../redux/app.slice';
import authReducer from '../redux/slices/authSlice';
import aboutReducer from '../redux/slices/aboutSlice';
import projectReducer from '../redux/slices/projectSlice';
import serviceReducer from '../redux/slices/serviceSlice';
import contactFormReducer from '../redux/slices/contactFormSlice';
import usersReducer from '../redux/slices/usersSlice';
import quoteFormReducer from '../redux/slices/quoteFormSlice';

function configureReduxStore(preloadedState = {}) {
  const store = configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      about: aboutReducer,
      projects: projectReducer,
      services: serviceReducer,
      contactForm: contactFormReducer,
      users: usersReducer,
      quoteForm: quoteFormReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    devTools: import.meta.env.VITE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
    preloadedState,
  });

  return store;
}

export type AppStore = ReturnType<typeof configureReduxStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
export default configureReduxStore;
