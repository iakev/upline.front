import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the user object (adjust as needed based on your API response)
export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string; // Example: Add other relevant user fields
  // Add other user properties as needed
}

// Export the state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Attempt to load initial state from sessionStorage
const storedToken = sessionStorage.getItem('token');
const storedUserString = sessionStorage.getItem('user');
const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // Store in sessionStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Remove from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    // Add other auth-related actions if needed (e.g., updateUser)
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        sessionStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logOut, updateUser } = authSlice.actions;

// Selector to easily get the current user ID (useful for prepareHeaders)
export const selectCurrentUserId = (state: { auth: AuthState }) => state.auth.user?.id;

export default authSlice.reducer;
