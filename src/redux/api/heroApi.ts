import { apiSlice } from './apiSlice';

// === Interfaces based on backend routes and potential data ===

// Define the structure of a single Hero item
interface HeroItem {
  heroId: number | string; // Or use just 'id' if consistent with other APIs
  title: string;
  image?: string; // Optional image URL/path
  isActive?: boolean;
  // Add other fields returned/used by your API (e.g., createdAt, createdBy)
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
}

// Define the expected response structure for fetching multiple heros
interface GetHerosResponse {
  heros: HeroItem[]; // Assuming the backend returns an array under this key
  pagination?: {
    // Assuming pagination is optional or included
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

// Define the query arguments for fetching multiple heros (based on validation)
interface GetHerosQueryArgs {
  pageSize?: number;
  pageNumber?: number;
  heroId?: number | string;
  title?: string;
  content?: string;
  isActive?: boolean;
  createdBy?: string;
}

// Define the response structure for image upload
interface UploadImageResponse {
  imageUrl: string; // Assuming the backend returns the URL of the uploaded image
}

// Define the response structure for delete (assuming simple success/ID)
interface DeleteHeroResponse {
  success: boolean;
  id: string | number;
}

// === API Slice Enhancement ===

export const heroApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query: Get a list of hero items (using POST for query flexibility)
    getHeros: builder.query<GetHerosResponse, GetHerosQueryArgs>({
      query: (args) => ({
        url: '/hero', // Matches POST /
        method: 'POST',
        body: args, // Send query parameters in the body
      }),
      // Example transformResponse if data is nested (adjust if needed)
      // transformResponse: (response: { data: GetHerosResponse }) => response.data,
      providesTags: (result) =>
        result?.heros
          ? [...result.heros.map(({ heroId }) => ({ type: 'Hero' as const, id: heroId })), { type: 'Hero', id: 'LIST' }]
          : [{ type: 'Hero', id: 'LIST' }],
    }),

    // Query: Get a single hero item by ID
    getHero: builder.query<HeroItem, string | number>({
      // Matches GET /:heroId
      query: (id) => `/hero/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hero', id }],
    }),

    // Mutation: Add a new hero item
    addHero: builder.mutation<HeroItem, Partial<HeroItem>>({
      // Matches POST /add
      query: (newHero) => ({
        url: '/hero/add',
        method: 'POST',
        body: newHero,
      }),
      invalidatesTags: [{ type: 'Hero', id: 'LIST' }],
    }),

    // Mutation: Update an existing hero item
    updateHero: builder.mutation<HeroItem, { heroId: string | number } & Partial<HeroItem>>({
      // Matches PUT or PATCH /:heroId
      query: ({ heroId, ...updatedFields }) => ({
        url: `/hero/${heroId}`,
        method: 'PUT', // Or 'PATCH' - choose one based on backend behavior
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { heroId }) => [{ type: 'Hero', id: heroId }],
    }),

    // Mutation: Delete a hero item
    deleteHero: builder.mutation<DeleteHeroResponse, string | number>({
      // Matches DELETE /:heroId
      query: (heroId) => ({
        url: `/hero/${heroId}`,
        method: 'DELETE',
      }),
      // Invalidate both the specific item and the list cache
      invalidatesTags: (result, error, heroId) => [
        { type: 'Hero', id: heroId },
        { type: 'Hero', id: 'LIST' },
      ],
    }),

    // Mutation: Upload image for hero section
    uploadHeroImage: builder.mutation<UploadImageResponse, FormData>({
      // Matches POST /upload-image
      query: (formData) => ({
        url: '/hero/upload-image',
        method: 'POST',
        body: formData,
        formData: true, // Required for FormData uploads
      }),
      // Decide on invalidation. Example: invalidate the specific hero if image URL is updated on it
      // invalidatesTags: (result, error, formData) => {
      //    const relatedHeroId = formData.get('heroId'); // Example if ID is passed in FormData
      //    return relatedHeroId ? [{ type: 'Hero', id: relatedHeroId }] : [];
      // }
      // Or invalidate the whole list if unsure which item is affected
      // invalidatesTags: [{ type: 'Hero', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetHerosQuery,
  useLazyGetHerosQuery, // Good practice to export lazy query
  useGetHeroQuery, // Renamed from getHeroById for consistency
  useAddHeroMutation,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
  useUploadHeroImageMutation,
} = heroApi;
