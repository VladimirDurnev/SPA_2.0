import { combineReducers } from '@reduxjs/toolkit';

import { incidentsReducer } from '@/modules/incidents';
import { usersReducer } from '@/modules/users';

export const rootReducer = combineReducers({
  incidents: incidentsReducer,
  users: usersReducer,
});
