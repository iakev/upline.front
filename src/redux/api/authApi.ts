import { apiSlice } from './apiSlice';
import { setCredentials, logOut, User } from '../slices/authSlice';
import {
  RegisterInputState,
  LoginInputState,
  ForgotPasswordInputState,
  ResetPasswordInputState,
} from '../../featureConfig/authConfig'; // Import input types
import logger from '../../utils/logger'; // Added logger import

// Define expected response for login/register (adjust based on actual API)
interface AuthResponse {
  user: User;
  tokens: {
    // Assuming tokens are nested
    access: { token: string; expires: string };
    refresh: { token: string; expires: string };
  };
  // Add any other relevant fields from the response
}

// Define args for mutations where not directly using config types
interface RefreshTokenArgs {
  refreshToken: string;
}

interface ResetPasswordArgs extends ResetPasswordInputState {
  token: string; // Token from query param needs to be included
}

interface VerifyEmailArgs {
  token: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation: User Login
    login: builder.mutation<AuthResponse, LoginInputState>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // No invalidation typically needed, handle state via onQueryStarted
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Dispatch setCredentials on successful login
          dispatch(setCredentials({ user: data.user, token: data.tokens.access.token }));
          // Optionally store refresh token securely if needed for refresh logic
          // sessionStorage.setItem('refreshToken', data.tokens.refresh.token);
        } catch (_error) {
          // console.error('Login failed:', error);
          logger.error('Login failed:', _error); // Use logger
          // Optional: dispatch an error action
        }
      },
    }),

    // Mutation: User Registration
    register: builder.mutation<AuthResponse, RegisterInputState>({
      // Assuming response is similar to login
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
      // Potentially invalidate user list if admins can see pending users, otherwise handle via onQueryStarted
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Dispatch setCredentials on successful registration
          dispatch(setCredentials({ user: data.user, token: data.tokens.access.token }));
          // sessionStorage.setItem('refreshToken', data.tokens.refresh.token);
        } catch (_error) {
          // console.error('Registration failed:', error);
          logger.error('Registration failed:', _error); // Use logger
        }
      },
    }),

    // Mutation: User Logout
    logout: builder.mutation<{ message: string }, { refreshToken: string }>({
      // Assuming body needs refresh token
      query: ({ refreshToken }) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refreshToken },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Dispatch logOut action regardless of API success/failure for frontend state
          dispatch(logOut());
          // Optionally clear other related state or API cache
          // dispatch(apiSlice.util.resetApiState());
        } catch (_error) {
          // console.error('Logout API call failed, logging out frontend anyway:', error);
          logger.error('Logout API call failed, logging out frontend anyway:', _error); // Use logger
          // Still log out on frontend even if API fails
          dispatch(logOut());
          // dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // Mutation: Refresh Tokens (Example - implement if needed)
    refreshTokens: builder.mutation<AuthResponse['tokens'], RefreshTokenArgs>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh-tokens',
        method: 'POST',
        body: { refreshToken },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update the stored access token (or dispatch action if token is in Redux state)
          const userString = sessionStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            dispatch(setCredentials({ user: user, token: data.access.token }));
          }
          // sessionStorage.setItem('refreshToken', data.refresh.token);
        } catch (_error) {
          // console.error('Token refresh failed:', error);
          logger.error('Token refresh failed:', _error); // Use logger
          // Force logout if refresh fails
          dispatch(logOut());
        }
      },
    }),

    // Mutation: Forgot Password
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordInputState>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: body,
      }),
    }),

    // Mutation: Reset Password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordArgs>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: 'POST',
        body: { password }, // Only send password in body
      }),
    }),

    // Mutation: Send Verification Email
    sendVerificationEmail: builder.mutation<{ message: string }, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/send-verification-email?token=${token}`, // Backend expects token in query
        method: 'POST',
        // No body needed based on backend validation
      }),
    }),

    // Mutation: Verify Email
    verifyEmail: builder.mutation<{ message: string }, VerifyEmailArgs>({
      query: ({ token }) => ({
        url: `/auth/verify-email?token=${token}`, // Backend expects token in query
        method: 'POST',
        // No body needed based on backend validation
      }),
      // Optionally invalidate user data upon successful verification
      invalidatesTags: (_result, _error, { token: _token }) => [
        /* Potentially invalidate user tag */
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokensMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} = authApi;
