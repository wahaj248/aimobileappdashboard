import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trialDays: 14,
  expiryAction: 'restrict', // 'restrict' | 'free_tier'
};

const trialSlice = createSlice({
  name: 'trial',
  initialState,
  reducers: {
    setTrialDays: (state, action) => {
      state.trialDays = action.payload;
    },
    setExpiryAction: (state, action) => {
      state.expiryAction = action.payload;
    },
  },
});

export const { setTrialDays, setExpiryAction } = trialSlice.actions;
export default trialSlice.reducer;
