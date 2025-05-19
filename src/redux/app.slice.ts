import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Export the state interface
export interface AppState {
  loading: boolean;
  darkmode: boolean;
  alert: any;
  error: any;
  allowScrollAboveNavbar: boolean;
  errorDialog: {
    show: boolean;
    message: string;
    title: string;
  };
  locations: any[];
}

const initialState = {
  loading: false,
  darkmode: false,
  alert: {},
  error: {},
  allowScrollAboveNavbar: true,
  errorDialog: {
    show: false,
    message: '',
    title: '',
  },
  locations: [],
} satisfies AppState as AppState;

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    showAlert: (state, action: PayloadAction<{ alert: any }>) => {
      state.alert = action.payload.alert;
    },
    toggleDarkMode: (state) => {
      state.darkmode = !state.darkmode;
      localStorage.setItem('darkmode', String(state.darkmode));
    },
    toggleScrollAboveNavbar: (state) => {
      state.allowScrollAboveNavbar = !state.allowScrollAboveNavbar;
    },
  },
});

export const { setLoading, showAlert, toggleDarkMode, toggleScrollAboveNavbar } = appSlice.actions;

export default appSlice.reducer;
