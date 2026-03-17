import { createSlice } from '@reduxjs/toolkit';

const STATIC_USER_SUBSCRIPTIONS = [
  { id: 1, userId: 1, userName: 'Admin User', planId: 2, planName: 'Pro', price: 19.99, startDate: '2024-01-15', endDate: '2025-01-15', status: 'Active' },
  { id: 2, userId: 2, userName: 'John Doe', planId: 1, planName: 'Basic', price: 9.99, startDate: '2024-02-01', endDate: '2025-02-01', status: 'Active' },
  { id: 3, userId: 3, userName: 'Jane Smith', planId: 2, planName: 'Pro', price: 19.99, startDate: '2024-03-01', endDate: '2024-03-15', status: 'Trial' },
  { id: 4, userId: 4, userName: 'Bob Wilson', planId: 3, planName: 'Enterprise', price: 49.99, startDate: '2023-06-01', endDate: '2024-06-01', status: 'Expired' },
  { id: 5, userId: 5, userName: 'Alice Brown', planId: 1, planName: 'Basic', price: 9.99, startDate: '2024-01-01', endDate: '2024-02-01', status: 'Cancelled' },
];

const initialState = {
  userSubscriptions: STATIC_USER_SUBSCRIPTIONS,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUserSubscriptionPlan: (state, action) => {
      const { subscriptionId, planId, planName, price } = action.payload;
      const sub = state.userSubscriptions.find(s => s.id === subscriptionId);
      if (sub) {
        sub.planId = planId;
        sub.planName = planName;
        sub.price = price;
      }
    },
  },
});

export const { clearError, updateUserSubscriptionPlan } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
