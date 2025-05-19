import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import storageHelper from '../../utils/storageHelper';

// Access Vite environment variable
const API_URL = import.meta.env.VITE_APP_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL environment variable not defined');
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers: Headers, { getState }): Headers => {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      const metaValue = storageHelper.get('$meta');
      if (typeof metaValue === 'string') {
        headers.set('x-meta', metaValue);
      } else if (metaValue !== null) {
        headers.set('x-meta', JSON.stringify(metaValue));
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');

      const state = getState() as any; // ue getState for future
      const userId = state.auth?.userId;
      if (userId) {
        headers.set('x-user-id', String(userId));
      }
      return headers;
    },
  }),
  tagTypes: ['Users', 'Services', 'Projects', 'ContactForm', 'About', 'Auth', 'Quote', 'Hero'],
  endpoints: () => ({}),
});

export default apiSlice;
