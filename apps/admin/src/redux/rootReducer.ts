import { combineReducers } from '@reduxjs/toolkit';
import auth from './authSlice';
import common from './commonSlice';

export const rootReducer = combineReducers({
  auth,
  common,
});
