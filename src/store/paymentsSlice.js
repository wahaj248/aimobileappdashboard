import { createSlice } from '@reduxjs/toolkit';

const STATIC_PAYMENTS = [
  { id: 1, userId: 1, userName: 'Admin User', amount: 19.99, gateway: 'Stripe', status: 'Success', date: '2024-03-01', invoiceId: 'INV-001' },
  { id: 2, userId: 2, userName: 'John Doe', amount: 9.99, gateway: 'PayPal', status: 'Success', date: '2024-03-02', invoiceId: 'INV-002' },
  { id: 3, userId: 3, userName: 'Jane Smith', amount: 19.99, gateway: 'Stripe', status: 'Failed', date: '2024-03-03', invoiceId: 'INV-003' },
  { id: 4, userId: 4, userName: 'Bob Wilson', amount: 49.99, gateway: 'Stripe', status: 'Pending', date: '2024-03-04', invoiceId: 'INV-004' },
  { id: 5, userId: 5, userName: 'Alice Brown', amount: 9.99, gateway: 'PayPal', status: 'Refunded', date: '2024-02-15', invoiceId: 'INV-005' },
];

const initialState = {
  payments: STATIC_PAYMENTS,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setPaymentStatus: (state, action) => {
      const { id, status } = action.payload;
      const p = state.payments.find(x => x.id === id);
      if (p) p.status = status;
    },
  },
});

export const { clearError, setPaymentStatus } = paymentsSlice.actions;
export default paymentsSlice.reducer;
