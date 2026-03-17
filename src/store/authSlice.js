import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginLoading: (state, action) => {
      state.loading = action.payload ?? true;
      if (action.payload === false) state.error = null;
    },
    setLoginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoginSuccess: (state, action) => {
      const payload = action.payload || {};
      state.user = payload.user ?? payload.data?.user ?? payload.data ?? null;
      state.token = payload.token ?? payload.data?.token ?? payload.access_token ?? null;
      state.isAuthenticated = !!(state.user && state.token);
      state.error = null;
      state.loading = false;
    },
    setProfileSuccess: (state, action) => {
      const payload = action.payload || {};
      const profile = payload.data ?? payload.user ?? payload ?? null;
      if (profile) {
        state.user = profile;
        state.isAuthenticated = !!(state.user && state.token);
      }
    },
    logoutManual: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('persist:auth');
        } catch (_) {}
      }
    },
  },
});

export const {
  setLoginLoading,
  setLoginError,
  setLoginSuccess,
  setProfileSuccess,
  logoutManual,
} = authSlice.actions;

export default authSlice.reducer;
