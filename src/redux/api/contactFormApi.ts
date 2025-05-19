import { apiSlice } from './apiSlice';

// --- Contact Form Interfaces (Adjust based on actual backend response) ---
interface ContactFormSubmission {
  contactFormSubmissionId: number | string; // Use the actual ID field name and type
  name: string;
  email: string;
  message: string;
  submittedAt?: string; // Assuming backend adds timestamp
  isRead?: boolean; // Assuming status tracking might exist
  // Add other fields as needed
}

interface GetContactFormsResponse {
  contactForms: ContactFormSubmission[]; // Assuming the key is 'contactForms'
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

interface GetContactFormsQueryArgs {
  pageSize?: number;
  pageNumber?: number;
  contactFormSubmissionId?: number | string;
  name?: string;
  email?: string;
  isRead?: boolean; // Filter by read status
}

// Input type for the addContactForm mutation
interface AddContactFormArgs {
  name: string;
  email: string;
  message: string;
}

// --- Contact Form API Slice ---
export const contactFormApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation: Add a new contact form submission
    addContactForm: builder.mutation<ContactFormSubmission, AddContactFormArgs>({
      query: (newSubmission) => ({
        url: '/contactForms', // Matches backend POST route
        method: 'POST',
        body: newSubmission,
      }),
      // No invalidation needed typically for a simple submission,
      // unless you have a list view that needs immediate update.
      // invalidatesTags: [{ type: 'ContactForm', id: 'LIST' }],
    }),

    // --- Endpoints likely for Admin Interface ---

    // Query: Get list of contact form submissions (using POST for filtering/pagination as confirmed)
    getContactForms: builder.query<GetContactFormsResponse, GetContactFormsQueryArgs>({
      query: (args) => ({
        url: '/contactForms', // Revert to original or confirmed POST endpoint URL
        method: 'POST', // Revert to POST method
        body: args, // Pass arguments as body
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.contactForms.map(({ contactFormSubmissionId }) => ({
                type: 'ContactForm' as const,
                id: contactFormSubmissionId,
              })),
              { type: 'ContactForm' as const, id: 'LIST' },
            ]
          : [{ type: 'ContactForm' as const, id: 'LIST' }],
    }),

    // Query: Get a single contact form submission by ID
    getContactForm: builder.query<ContactFormSubmission, string | number>({
      query: (id) => `/contactForms/${id}`,
      providesTags: (result, error, id) => [{ type: 'ContactForm', id }],
    }),

    // Mutation: Update a contact form submission (e.g., mark as read)
    updateContactForm: builder.mutation<
      ContactFormSubmission,
      { contactFormSubmissionId: string | number } & Partial<ContactFormSubmission>
    >({
      query: ({ contactFormSubmissionId, ...updatedFields }) => ({
        url: `/contactForms/${contactFormSubmissionId}`,
        method: 'PUT', // or PATCH
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { contactFormSubmissionId }) => [
        { type: 'ContactForm', id: contactFormSubmissionId },
      ],
    }),

    // Mutation: Delete a contact form submission
    deleteContactForm: builder.mutation<{ success: boolean; id: string | number }, string | number>({
      query: (contactFormSubmissionId) => ({
        url: `/contactForms/${contactFormSubmissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, contactFormSubmissionId) => [{ type: 'ContactForm', id: contactFormSubmissionId }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useAddContactFormMutation,
  // Admin hooks (optional)
  useGetContactFormsQuery,
  useLazyGetContactFormsQuery,
  useGetContactFormQuery,
  useUpdateContactFormMutation,
  useDeleteContactFormMutation,
} = contactFormApi;
