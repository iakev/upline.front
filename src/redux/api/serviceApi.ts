import { apiSlice } from './apiSlice';

// --- Service Interfaces (Adjust based on actual backend response) ---
interface Service {
  serviceId: number | string; // Use the actual ID field name and type
  title: string;
  description: string;
  image: string; // URL of the main image
  isActive?: boolean; // Assuming this might exist
  // Add other fields as needed
}

interface GetServicesResponse {
  services: Service[]; // Assuming the key is 'services'
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

interface GetServicesQueryArgs {
  pageSize?: number;
  pageNumber?: number;
  serviceId?: number | string;
  title?: string;
  description?: string;
  isActive?: boolean;
}

// --- Service API Slice ---
export const serviceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query: Get list of services (using POST for filtering/pagination)
    getServices: builder.query<GetServicesResponse, GetServicesQueryArgs>({
      query: (args) => ({
        url: '/services', // Matches backend route
        method: 'POST',
        body: args,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.services.map(({ serviceId }) => ({ type: 'Services' as const, id: serviceId })),
              { type: 'Services' as const, id: 'LIST' },
            ]
          : [{ type: 'Services' as const, id: 'LIST' }],
    }),

    // Query: Get a single service by ID
    getService: builder.query<Service, string | number>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Services', id }],
    }),

    // Mutation: Add a new service
    addService: builder.mutation<Service, Partial<Service>>({
      query: (newService) => ({
        url: '/services/add', // Assuming endpoint exists
        method: 'POST',
        body: newService,
      }),
      invalidatesTags: [{ type: 'Services', id: 'LIST' }],
    }),

    // Mutation: Update an existing service
    updateService: builder.mutation<Service, { serviceId: string | number } & Partial<Service>>({
      query: ({ serviceId, ...updatedFields }) => ({
        url: `/services/${serviceId}`,
        method: 'PUT', // or PATCH
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { serviceId }) => [{ type: 'Services', id: serviceId }],
    }),

    // Mutation: Delete a service
    deleteService: builder.mutation<{ success: boolean; id: string | number }, string | number>({
      query: (serviceId) => ({
        url: `/services/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, serviceId) => [{ type: 'Services', id: serviceId }],
    }),

    // Mutation: Upload image for a service (Assuming similar endpoint structure)
    uploadServiceImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({
        url: '/services/upload-image', // Adjust URL if different
        method: 'POST',
        body: formData,
        formData: true,
      }),
      // Optionally invalidate the specific service tag if needed
      // invalidatesTags: (result, error, formData) => { ... }
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetServicesQuery,
  useLazyGetServicesQuery,
  useGetServiceQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUploadServiceImageMutation,
} = serviceApi;
