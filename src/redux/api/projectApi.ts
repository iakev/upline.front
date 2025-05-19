import { apiSlice } from './apiSlice';

// --- Project Interfaces (Adjust based on actual backend response) ---
interface Project {
  projectId: number | string; // Use the actual ID field name and type
  title: string;
  location: string;
  image: string; // URL of the main image
  category: string;
  description?: string; // Optional description
  startDate?: string; // Optional date
  endDate?: string; // Optional date
  isActive?: boolean;
  // Add other fields as needed
}

interface GetProjectsResponse {
  projects: Project[]; // Assuming the key is 'projects'
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

interface GetProjectsQueryArgs {
  pageSize?: number;
  pageNumber?: number;
  projectId?: number | string;
  title?: string;
  category?: string;
  location?: string;
  isActive?: boolean;
}

// --- Project API Slice ---
export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query: Get list of projects (using POST for filtering/pagination)
    getProjects: builder.query<GetProjectsResponse, GetProjectsQueryArgs>({
      query: (args) => ({
        url: '/projects', // Matches backend route
        method: 'POST',
        body: args,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.projects.map(({ projectId }) => ({ type: 'Projects' as const, id: projectId })),
              { type: 'Projects' as const, id: 'LIST' },
            ]
          : [{ type: 'Projects' as const, id: 'LIST' }],
    }),

    // Query: Get a single project by ID
    getProject: builder.query<Project, string | number>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),

    // Mutation: Add a new project
    addProject: builder.mutation<Project, Partial<Project>>({
      query: (newProject) => ({
        url: '/projects/add', // Assuming endpoint exists
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),

    // Mutation: Update an existing project
    updateProject: builder.mutation<Project, { projectId: string | number } & Partial<Project>>({
      query: ({ projectId, ...updatedFields }) => ({
        url: `/projects/${projectId}`,
        method: 'PUT', // or PATCH
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Projects', id: projectId }],
    }),

    // Mutation: Delete a project
    deleteProject: builder.mutation<{ success: boolean; id: string | number }, string | number>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, projectId) => [{ type: 'Projects', id: projectId }],
    }),

    // Mutation: Upload image for a project (Assuming similar endpoint structure)
    uploadProjectImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({
        url: '/projects/upload-image', // Adjust URL if different
        method: 'POST',
        body: formData,
        formData: true,
      }),
      // Optionally invalidate the specific project tag if needed
      // invalidatesTags: (result, error, formData) => { ... }
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadProjectImageMutation,
} = projectApi;
