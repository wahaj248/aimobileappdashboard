import { createSlice } from '@reduxjs/toolkit';

const STATIC_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com' },
  { id: 2, name: 'John Doe', email: 'john@example.com' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com' },
];

const initialState = {
  users: STATIC_USERS,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addUser: (state, action) => {
      const newUser = {
        id: state.users.length ? Math.max(...state.users.map((u) => u.id)) + 1 : 1,
        name: action.payload.name || '',
        email: action.payload.email || '',
      };
      state.users.push(newUser);
    },
    updateUserLocal: (state, action) => {
      const { id, name, email } = action.payload;
      const index = state.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        if (name !== undefined) state.users[index].name = name;
        if (email !== undefined) state.users[index].email = email;
      }
    },
    deleteUserLocal: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
});

export const { clearError, addUser, updateUserLocal, deleteUserLocal } = usersSlice.actions;
export default usersSlice.reducer;
