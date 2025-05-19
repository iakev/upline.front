import { apiSlice } from './apiSlice';

// Define the expected response type if known, otherwise use a generic or leave it inferred
// interface QuoteSubmissionResponse {
//   success: boolean;
//   message: string;
// }

// Define the expected argument type for the mutation
// For forms with file uploads, FormData is typically used.
// Alternatively, define an interface for the form fields if sending JSON.
type QuoteFormData = FormData;

export const quoteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addQuote: builder.mutation<any, QuoteFormData>({
      query: (formData) => ({
        url: '/api/quotes', // Adjust API endpoint as necessary
        method: 'POST',
        body: formData,
        // If your server doesn't correctly handle FormData Content-Type,
        // you might need to uncomment the following or set it manually in a prepareHeaders function
        // headers: {
        //   'Content-Type': 'multipart/form-data', // Usually handled automatically by browser fetch with FormData
        // },
      }),
      // Example: Invalidate a list of quotes if you have one
      // invalidatesTags: [{ type: 'Quote', id: 'LIST' }],
      invalidatesTags: ['Quote'], // Simple invalidation tag
    }),
  }),
});

export const { useAddQuoteMutation } = quoteApi;
