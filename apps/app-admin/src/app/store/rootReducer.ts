import { combineReducers } from '@reduxjs/toolkit';

import { usersReducer } from '@/modules/users';

export const rootReducer = combineReducers({
  users: usersReducer,
});
