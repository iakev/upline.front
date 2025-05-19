import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Assuming featureConfig directory exists and contains projectConfig
import { projectConfig, ProjectInputState, ProjectConfig } from '../../featureConfig/projectConfig';

interface ErrorState {
  [key: string]: string[]; // Field name maps to array of error messages
}

interface ErrorDialogState {
  show: boolean;
  message: string;
  title: string;
}

// Add specific states needed for Projects UI, e.g., filter state
// Export the state interface
export interface ProjectSliceState {
  config: ProjectConfig;
  error: ErrorState;
  errorDialog: ErrorDialogState;
  activeCategoryFilter: string; // Example: state for filtering projects
}

const initialState: ProjectSliceState = {
  // Deep copy initial config
  config: JSON.parse(JSON.stringify(projectConfig)),
  error: {},
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
  activeCategoryFilter: 'All', // Initialize filter state
};

const projectSlice = createSlice({
  name: 'projects', // Use 'projects' as the slice name
  initialState,
  reducers: {
    setErrorDialog: (state, action: PayloadAction<{ alert: ErrorDialogState }>) => {
      state.errorDialog = action.payload.alert;
    },
    updatePagination: (state, action: PayloadAction<Partial<ProjectConfig['pagination']>>) => {
      state.config.pagination = {
        ...state.config.pagination,
        ...action.payload,
      };
    },
    resetInputs: (state) => {
      state.config.projectInputs = JSON.parse(JSON.stringify(projectConfig.projectInputs));
      state.error = {};
    },
    editInputs: (state, action: PayloadAction<{ name: keyof ProjectInputState; value: any; error?: string[] }>) => {
      const { name, value, error } = action.payload;
      if (typeof name === 'string') {
        if (error && error.length > 0) {
          state.error[name] = error;
        } else {
          delete state.error[name];
        }
      }
      if (name in state.config.projectInputs) {
        // Assert type to resolve assignment error
        (state.config.projectInputs as Record<keyof ProjectInputState, any>)[name] = value;
      }
    },
    setAllInputs: (state, action: PayloadAction<ProjectInputState>) => {
      state.config.projectInputs = action.payload;
      state.error = {};
    },
    // Example reducer for project-specific UI state
    setActiveCategoryFilter: (state, action: PayloadAction<string>) => {
      state.activeCategoryFilter = action.payload;
      // Optionally reset pagination when filter changes
      state.config.pagination.pageNumber = 1;
    },
  },
});

export const {
  setErrorDialog,
  updatePagination,
  resetInputs,
  editInputs,
  setAllInputs,
  setActiveCategoryFilter, // Export new action
} = projectSlice.actions;

export default projectSlice.reducer;
