import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { contactFormConfig, ContactFormConfig } from '../../featureConfig/contactFormConfig';

// Note: Input state is not managed here as useGenericForm handles it locally.
// We only manage UI state related to submission feedback (dialog) and potentially admin view state.

interface ErrorDialogState {
  show: boolean;
  message: string;
  title: string;
}

// Export the state interface
export interface ContactFormSliceState {
  // We include the config reference for pagination settings (if viewing submissions)
  config: ContactFormConfig;
  errorDialog: ErrorDialogState;
  error: { [key: string]: string | null }; // Add error state for inputs
  // Add state for admin view if needed (e.g., selectedSubmissionId)
}

const initialState: ContactFormSliceState = {
  // Don't need a deep copy if we only read pagination from it initially
  config: contactFormConfig,
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
  error: {}, // Initialize error state
};

const contactFormSlice = createSlice({
  name: 'contactForm',
  initialState,
  reducers: {
    // Only reducer needed for basic form submission feedback
    setErrorDialog: (state, action: PayloadAction<{ alert: ErrorDialogState }>) => {
      state.errorDialog = action.payload.alert;
    },
    // Reducers for admin view state (optional)
    updatePagination: (state, action: PayloadAction<Partial<ContactFormConfig['pagination']>>) => {
      state.config.pagination = {
        ...state.config.pagination,
        ...action.payload,
      };
    },
    // Modify editInputs: Only update error state in Redux
    editInputs: (state, action: PayloadAction<{ name: string; value: any; error: string | null }>) => {
      const { name, error } = action.payload;
      if (error && error.length > 0) {
        state.error[name] = error;
      } else {
        delete state.error[name]; // Remove error if null/empty
      }
      // DO NOT update state.config.contactFormInputs here
    },
    // Modify resetInputs: Only clear Redux error state
    resetInputs: (state) => {
      state.error = {}; // Clear errors
      // DO NOT reset state.config.contactFormInputs here (local state handles reset)
    },
    // Add other reducers if needed (e.g., selectSubmission)
  },
});

export const {
  setErrorDialog,
  updatePagination, // Export if admin view is implemented
  editInputs, // Export new action
  resetInputs, // Export new action
} = contactFormSlice.actions;

export default contactFormSlice.reducer;
