import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the quote form inputs
interface QuoteFormInputState {
  name: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  budget: string;
  file: File | null; // Assuming file is handled, adjust if needed
}

// Minimal config structure, just holding the inputs for now
interface QuoteFormConfig {
  quoteInputs: QuoteFormInputState;
  // Add pagination etc. later if needed for viewing quotes
}

// Define the initial default values
const initialQuoteInputs: QuoteFormInputState = {
  name: '',
  email: '',
  phone: '',
  service: '',
  description: '',
  budget: '',
  file: null,
};

// Reusable Error Dialog state shape
interface ErrorDialogState {
  show: boolean;
  message: string;
  title: string;
}

// Define the slice state
export interface QuoteFormSliceState {
  config: QuoteFormConfig;
  errorDialog: ErrorDialogState;
  error: { [key: string]: string | null }; // Input validation errors
}

// Define the initial state for the slice
const initialState: QuoteFormSliceState = {
  config: {
    quoteInputs: { ...initialQuoteInputs }, // Use a copy
  },
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
  error: {},
};

const quoteFormSlice = createSlice({
  name: 'quoteForm',
  initialState,
  reducers: {
    // Reducer to update the error dialog state
    setErrorDialog: (state, action: PayloadAction<{ alert: ErrorDialogState }>) => {
      state.errorDialog = action.payload.alert;
    },
    // Reducer to handle input changes and validation errors
    editInputs: (state, action: PayloadAction<{ name: string; value: any; error: string | null }>) => {
      const { name, error } = action.payload;
      if (error && error.length > 0) {
        state.error[name] = error;
      } else {
        delete state.error[name]; // Remove error if null/empty
      }
      // DO NOT update state.config.quoteInputs here
    },
    // Reducer to reset inputs to their initial default state
    resetInputs: (state) => {
      state.error = {}; // Clear errors
      // DO NOT reset state.config.quoteInputs here
    },
    // Add other reducers if needed (e.g., for pagination when viewing quotes)
  },
});

// Export the action creators
export const { setErrorDialog, editInputs, resetInputs } = quoteFormSlice.actions;

// Export the reducer
export default quoteFormSlice.reducer;
