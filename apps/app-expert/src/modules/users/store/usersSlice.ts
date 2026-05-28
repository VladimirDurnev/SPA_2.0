import type { User } from '../types';

import { createSlice } from '@reduxjs/toolkit';
import { fetchUsersThunk } from '../api/usersThunks';

export interface UsersState {
  items: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки';
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
