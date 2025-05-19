import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { usersConfig, UserInputState, UpdateUserInputState, UsersConfig } from '../../featureConfig/usersConfig';

// Reusing interfaces from other slices/configs might be possible if structure is identical
interface ErrorState {
  [key: string]: string[];
}

interface ErrorDialogState {
  show: boolean;
  message: string;
  title: string;
}

// Export the state interface
export interface UsersSliceState {
  config: UsersConfig;
  addUserError: ErrorState; // Separate errors for add/update forms
  updateUserError: ErrorState;
  errorDialog: ErrorDialogState;
  // Add other UI states like selected user ID for editing, etc.
  selectedUserId: number | string | null;
}

const initialState: UsersSliceState = {
  config: JSON.parse(JSON.stringify(usersConfig)),
  addUserError: {},
  updateUserError: {},
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
  selectedUserId: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setErrorDialog: (state, action: PayloadAction<{ alert: ErrorDialogState }>) => {
      state.errorDialog = action.payload.alert;
    },
    updatePagination: (state, action: PayloadAction<Partial<UsersConfig['pagination']>>) => {
      state.config.pagination = {
        ...state.config.pagination,
        ...action.payload,
      };
    },
    // Add User Form Management
    resetAddUserInputs: (state) => {
      state.config.usersInputs = JSON.parse(JSON.stringify(usersConfig.usersInputs));
      state.addUserError = {};
    },
    editAddUserInputs: (state, action: PayloadAction<{ name: keyof UserInputState; value: any; error?: string[] }>) => {
      const { name, value, error } = action.payload;
      if (typeof name === 'string') {
        if (error && error.length > 0) {
          state.addUserError[name] = error;
        } else {
          delete state.addUserError[name];
        }
      }
      if (name in state.config.usersInputs) {
        // Assert type to resolve assignment error
        (state.config.usersInputs as Record<keyof UserInputState, any>)[name] = value;
      }
    },
    // Update User Form Management (Minimal state, only handles status updates currently)
    resetUpdateUserInputs: (state) => {
      state.config.updateUsersInputs = JSON.parse(JSON.stringify(usersConfig.updateUsersInputs));
      state.updateUserError = {};
    },
    editUpdateUserInputs: (
      state,
      action: PayloadAction<{ name: keyof UpdateUserInputState; value: any; error?: string[] }>,
    ) => {
      const { name, value, error } = action.payload;
      if (typeof name === 'string') {
        if (error && error.length > 0) {
          state.updateUserError[name] = error;
        } else {
          delete state.updateUserError[name];
        }
      }
      if (name in state.config.updateUsersInputs) {
        // Assert type to resolve assignment error
        (state.config.updateUsersInputs as Record<keyof UpdateUserInputState, any>)[name] = value;
      }
    },
    setAllUpdateUserInputs: (state, action: PayloadAction<UpdateUserInputState>) => {
      state.config.updateUsersInputs = action.payload;
      state.updateUserError = {};
    },
    // Selected User Management
    setSelectedUserId: (state, action: PayloadAction<number | string | null>) => {
      state.selectedUserId = action.payload;
      // Optionally load user data into update form when selected
      if (action.payload === null) {
        state.config.updateUsersInputs = JSON.parse(JSON.stringify(usersConfig.updateUsersInputs));
        state.updateUserError = {};
      }
    },
  },
});

export const {
  setErrorDialog,
  updatePagination,
  resetAddUserInputs,
  editAddUserInputs,
  resetUpdateUserInputs,
  editUpdateUserInputs,
  setAllUpdateUserInputs,
  setSelectedUserId,
} = usersSlice.actions;

export default usersSlice.reducer;
