import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import { fetchIncidentsTreeThunk } from '../api/incidentsThunks';

/** Загружает дерево один раз, если в store ещё пусто */
export function useLoadIncidentsTree() {
  const dispatch = useAppDispatch();
  const hasItems = useAppSelector(state => state.incidents.items.length > 0);

  useEffect(() => {
    if (!hasItems) {
      void dispatch(fetchIncidentsTreeThunk());
    }
  }, []);
}

export function useIncidentsTreeState() {
  return useAppSelector(state => state.incidents);
}
