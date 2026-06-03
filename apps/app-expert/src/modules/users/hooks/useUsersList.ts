import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import { fetchUsersThunk } from '../api/usersThunks';

export function useUsersList() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(state => state.users);

  useEffect(() => {
    void dispatch(fetchUsersThunk());
  }, [dispatch]);

  return { items, isLoading, error };
}
