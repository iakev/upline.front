import { apiSlice } from './apiSlice';

// Define the expected response structure for getAbouts (adjust as needed)
interface About {
  aboutId: number | string; // Use the actual type from your backend
  title: string;
  content: string;
  image: string; // Add the image property
  isActive: boolean;
  updatedBy?: string; // Adjust based on backend response
  // Add other fields returned by the API
}

interface GetAboutsResponse {
  aboutUs: About[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
    // Add other pagination fields if any
  };
}

// Define the body structure for the getAbouts query
interface GetAboutsQueryArgs {
  pageSize?: number;
  pageNumber?: number;
  aboutId?: number | string;
  title?: string;
  content?: string;
  isActive?: boolean;
  updatedBy?: string;
}

export const aboutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query: Get a list of about items (using POST)
    getAbouts: builder.query<GetAboutsResponse, GetAboutsQueryArgs>({
      query: ({ pageSize, pageNumber, aboutId, title, content, isActive, updatedBy }) => ({
        url: '/about',
        method: 'POST',
        body: {
          pageSize,
          pageNumber,
          ...(aboutId && { aboutId }),
          ...(title && { title }),
          ...(content && { content }),
          ...(isActive && { isActive }),
          ...(updatedBy && { updatedBy }),
        },
      }),
      // Assuming the response structure matches GetAboutsResponse
      // transformResponse is optional if the structure matches directly
      // transformResponse: (response: any) => ({
      //   abouts: response.aboutUs,
      //   pagination: response.pagination,
      // }),
      providesTags: (result) =>
        result
          ? [
              ...result.aboutUs.map(({ aboutId }) => ({ type: 'About' as const, id: aboutId })),
              { type: 'About' as const, id: 'LIST' },
            ]
          : [{ type: 'About' as const, id: 'LIST' }],
    }),

    // Query: Get a single about item by ID
    getAbout: builder.query<About, string | number>({
      // Assuming ID is string or number
      query: (id) => `/about/${id}`,
      providesTags: (result, error, id) => [{ type: 'About', id }],
    }),

    // Mutation: Add a new about item
    addAbout: builder.mutation<About, Partial<About>>({
      // Input is partial data for new item
      query: (newAbout) => ({
        url: '/about/add',
        method: 'POST',
        body: newAbout,
      }),
      invalidatesTags: [{ type: 'About', id: 'LIST' }], // Invalidate the list on add
    }),

    // Mutation: Update an existing about item
    updateAbout: builder.mutation<About, { aboutId: string | number } & Partial<About>>({
      // Input includes ID and partial data
      query: ({ aboutId, ...updatedFields }) => ({
        url: `/about/${aboutId}`,
        method: 'PUT', // or PATCH depending on your API
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { aboutId }) => [{ type: 'About', id: aboutId }], // Invalidate specific item
    }),

    // Mutation: Delete an about item
    deleteAbout: builder.mutation<{ success: boolean; id: string | number }, string | number>({
      // Expects ID, returns success/ID
      query: (aboutId) => ({
        url: `/about/${aboutId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, aboutId) => [{ type: 'About', id: aboutId }], // Invalidate specific item
    }),

    // Mutation: Upload image for about section (Example)
    uploadAboutImage: builder.mutation<{ imageUrl: string }, FormData>({
      // Expects FormData, returns image URL
      query: (formData) => ({
        url: '/about/upload-image',
        method: 'POST',
        body: formData,
        // IMPORTANT: Signal RTK Query it's FormData, it won't set Content-Type header automatically
        formData: true,
      }),
      // Decide if this should invalidate anything (maybe the item it relates to?)
      // invalidatesTags: (result, error, args) => [...]
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetAboutsQuery,
  useLazyGetAboutsQuery, // Use for triggering query manually
  useGetAboutQuery,
  useAddAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
  useUploadAboutImageMutation,
} = aboutApi;
