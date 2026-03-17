import { createSlice } from '@reduxjs/toolkit';

const STATIC_PLANS = [
  {
    id: 1,
    name: 'Basic',
    priceMonthly: 9.99,
    priceYearly: 99,
    billingCycle: 'monthly',
    features: { apiCalls: '1,000/month', maxUsers: 5, modules: 'Core only' },
    isActive: true,
  },
  {
    id: 2,
    name: 'Pro',
    priceMonthly: 19.99,
    priceYearly: 199,
    billingCycle: 'monthly',
    features: { apiCalls: '10,000/month', maxUsers: 25, modules: 'Core + Analytics' },
    isActive: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    priceMonthly: 49.99,
    priceYearly: 499,
    billingCycle: 'yearly',
    features: { apiCalls: 'Unlimited', maxUsers: 100, modules: 'All modules' },
    isActive: true,
  },
];

const initialState = {
  plans: STATIC_PLANS,
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    addPlan: (state, action) => {
      const newPlan = { ...action.payload, id: state.plans.length ? Math.max(...state.plans.map(p => p.id)) + 1 : 1 };
      state.plans.push(newPlan);
    },
    updatePlan: (state, action) => {
      const { id, ...rest } = action.payload;
      const i = state.plans.findIndex(p => p.id === id);
      if (i !== -1) state.plans[i] = { ...state.plans[i], ...rest };
    },
    setPlanActive: (state, action) => {
      const { id, isActive } = action.payload;
      const p = state.plans.find(plan => plan.id === id);
      if (p) p.isActive = isActive;
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter(p => p.id !== action.payload);
    },
  },
});

export const { clearError, addPlan, updatePlan, setPlanActive, deletePlan } = plansSlice.actions;
export default plansSlice.reducer;
