import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { serviceConfig, ServiceInputState, ServiceConfig } from '../../featureConfig/serviceConfig';

interface ErrorState {
  [key: string]: string[];
}

interface ErrorDialogState {
  show: boolean;
  message: string;
  title: string;
}

// Export the state interface
export interface ServiceSliceState {
  config: ServiceConfig;
  error: ErrorState;
  errorDialog: ErrorDialogState;
  // Add any other service-specific UI state here if needed
}

const initialState: ServiceSliceState = {
  config: JSON.parse(JSON.stringify(serviceConfig)),
  error: {},
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setErrorDialog: (state, action: PayloadAction<{ alert: ErrorDialogState }>) => {
      state.errorDialog = action.payload.alert;
    },
    updatePagination: (state, action: PayloadAction<Partial<ServiceConfig['pagination']>>) => {
      state.config.pagination = {
        ...state.config.pagination,
        ...action.payload,
      };
    },
    resetInputs: (state) => {
      state.config.serviceInputs = JSON.parse(JSON.stringify(serviceConfig.serviceInputs));
      state.error = {};
    },
    editInputs: (state, action: PayloadAction<{ name: keyof ServiceInputState; value: any; error?: string[] }>) => {
      const { name, value, error } = action.payload;
      if (typeof name === 'string') {
        if (error && error.length > 0) {
          state.error[name] = error;
        } else {
          delete state.error[name];
        }
      }
      if (name in state.config.serviceInputs) {
        // Assert type to resolve assignment error
        (state.config.serviceInputs as Record<keyof ServiceInputState, any>)[name] = value;
      }
    },
    setAllInputs: (state, action: PayloadAction<ServiceInputState>) => {
      state.config.serviceInputs = action.payload;
      state.error = {};
    },
  },
});

export const { setErrorDialog, updatePagination, resetInputs, editInputs, setAllInputs } = serviceSlice.actions;

export default serviceSlice.reducer;
