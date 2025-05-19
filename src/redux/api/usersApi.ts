import { apiSlice } from './apiSlice';
import { User } from '../slices/authSlice'; // Re-use User interface from authSlice

// --- User Interfaces (Adjust based on actual backend response) ---
// User interface is likely defined in authSlice, import it

interface GetUsersResponse {
  users: User[]; // Assuming the key is 'users'
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

interface GetUsersQueryArgs {
  pageSize?: number;
  pageNumber?: number;
  actorId?: number | string;
  isEnabled?: boolean;
  isLocked?: boolean;
  username?: string;
  fullName?: string;
}

// For Add User mutation - Define required fields based on backend
// This might be slightly different from RegisterInputState if backend handles some fields differently
interface AddUserArgs {
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender?: string;
  thumbNail?: File; // Expect File for upload
  actorId: number; // Assuming required based on validation
  identifier: string; // Password
  policyType: string;
}

// For Update User mutation
interface UpdateUserArgs {
  primaryLanguageId?: number | '';
  isEnabled?: boolean;
  isLocked?: boolean;
}

// For Role Assignment (can potentially reuse from authApi if defined there)
interface AssignRoleArgs {
  actorId: number;
  definedRoleId: number;
  actorPermissionId?: number;
}

// --- Users API Slice ---
export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query: Get list of users (assuming POST based on other examples, adjust if GET)
    getUsers: builder.query<GetUsersResponse, GetUsersQueryArgs>({
      query: (args) => ({
        url: '/users', // Check if backend uses GET with query params or POST with body
        method: 'POST',
        body: args,
      }),
      providesTags: (result) =>
        result
          ? [...result.users.map(({ id }) => ({ type: 'Users' as const, id })), { type: 'Users' as const, id: 'LIST' }]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),

    // Query: Get a single user by ID
    getUser: builder.query<User, string | number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // Mutation: Add a new user
    // Note: This might involve FormData if thumbNail is a file
    addUser: builder.mutation<User, AddUserArgs>({
      query: (newUser) => {
        // Handle potential file upload with FormData
        const formData = new FormData();
        Object.entries(newUser).forEach(([key, value]) => {
          if (key === 'thumbNail' && value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        return {
          url: '/users', // Matches backend POST route for add
          method: 'POST',
          body: formData,
          formData: true, // Indicate FormData usage
        };
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // Mutation: Update an existing user
    updateUser: builder.mutation<User, { actorId: string | number } & UpdateUserArgs>({
      query: ({ actorId, ...updatedFields }) => ({
        url: `/users/${actorId}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { actorId }) => [{ type: 'Users', id: actorId }],
    }),

    // Mutation: Delete a user
    deleteUser: builder.mutation<{ success: boolean; id: string | number }, string | number>({
      query: (actorId) => ({
        url: `/users/${actorId}`,
        method: 'DELETE',
      }),
      // Ensure deletion invalidates the list and the specific user
      invalidatesTags: (result, error, actorId) => [
        { type: 'Users', id: 'LIST' },
        { type: 'Users', id: actorId },
      ],
    }),

    // Mutation: Assign roles (assuming endpoint exists)
    assignRolesToUser: builder.mutation<any, AssignRoleArgs>({
      // Define specific return type if available
      query: (args) => ({
        url: '/users/assign-roles',
        method: 'POST',
        body: args,
      }),
      // Invalidate the specific user to potentially update their displayed roles
      invalidatesTags: (result, error, { actorId }) => [{ type: 'Users', id: actorId }],
    }),

    // Mutation: Edit assigned roles (assuming endpoint exists)
    editAssignedRolesForUser: builder.mutation<any, Partial<AssignRoleArgs> & { actorId: number }>({
      query: (args) => ({
        url: '/users/edit-assigned-roles', // Might need ID in URL depending on API design
        method: 'PUT',
        body: args,
      }),
      invalidatesTags: (result, error, { actorId }) => [{ type: 'Users', id: actorId }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignRolesToUserMutation,
  useEditAssignedRolesForUserMutation,
} = usersApi;
