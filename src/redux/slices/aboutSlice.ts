import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Assuming featureConfig directory exists and contains aboutConfig
// If not, this import will fail until the config file is created.
import { aboutConfig, AboutInputState, AboutConfig } from '../../featureConfig/aboutConfig';

interface ErrorState {
  [key: string]: string[]; // Field name maps to array of error messages
}

interface ErrorDialogState {
  show: boolean;
  message: string;
  title: string;
}

// Export the state interface
export interface AboutSliceState {
  config: AboutConfig;
  error: ErrorState;
  errorDialog: ErrorDialogState;
}

const initialState: AboutSliceState = {
  // Deep copy initial config to prevent mutation of the imported object
  config: JSON.parse(JSON.stringify(aboutConfig)),
  error: {},
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    setErrorDialog: (state, action: PayloadAction<{ alert: ErrorDialogState }>) => {
      state.errorDialog = action.payload.alert;
    },
    // Update specific pagination properties
    updatePagination: (state, action: PayloadAction<Partial<AboutConfig['pagination']>>) => {
      state.config.pagination = {
        ...state.config.pagination,
        ...action.payload,
      };
    },
    // Reset inputs to their initial state defined in the config
    resetInputs: (state) => {
      // Use the originally imported config for resetting
      state.config.aboutInputs = JSON.parse(JSON.stringify(aboutConfig.aboutInputs));
      state.error = {}; // Clear errors on reset
    },
    // Update a specific input field's value and error state
    editInputs: (state, action: PayloadAction<{ name: keyof AboutInputState; value: any; error?: string[] }>) => {
      const { name, value, error } = action.payload;
      // Ensure name is treated as a string for indexing ErrorState
      if (typeof name === 'string') {
        if (error && error.length > 0) {
          state.error[name] = error;
        } else {
          // Use delete operator to remove the key if there are no errors
          delete state.error[name];
        }
      }

      // Ensure the key exists before assigning
      if (name in state.config.aboutInputs) {
        // Assert type to resolve assignment error
        (state.config.aboutInputs as Record<keyof AboutInputState, any>)[name] = value;
      }
    },
    // Set all inputs at once (e.g., when loading data into a form for editing)
    setAllInputs: (state, action: PayloadAction<AboutInputState>) => {
      state.config.aboutInputs = action.payload;
      state.error = {}; // Clear previous errors
    },
  },
});

export const { setErrorDialog, updatePagination, resetInputs, editInputs, setAllInputs } = aboutSlice.actions;

export default aboutSlice.reducer;
