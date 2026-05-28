import type { User } from '../types';
import { http, mapHttpError } from '@org/core';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { USERS_LIST_API } from '../constants';

export const fetchUsersThunk = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>(
  'users/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get<User[]>(USERS_LIST_API);
      return data;
    }
    catch (error) {
      return rejectWithValue(mapHttpError(error, 'Не удалось загрузить список'));
    }
  },
);
