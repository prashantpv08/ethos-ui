// @ts-nocheck
import { configureStore, Action, Reducer, AnyAction } from '@reduxjs/toolkit';

import { thunk, ThunkAction, ThunkMiddleware } from 'redux-thunk';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { resetAuthorizationToken } from '../api';
import { rootReducer } from './rootReducer';

const reducerProxy: Reducer = (state: RootState, action: AnyAction) => {
  // on logout reset redux state
  if (action.type === 'auth/logout') {
    localStorage.removeItem('token');
    resetAuthorizationToken();
    return rootReducer({} as RootState, action);
  }
  return rootReducer(state, action);
};

const persistConfig = {
  debug: false,
  key: 'root',
  keyPrefix: 'v.1',
  storage,
  blacklist: [],
  // add reducer name to persist
  whitelist: ['auth', 'common'],
};
const persistedReducer = persistReducer(persistConfig, reducerProxy);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (
    getDefaultMiddleware: (arg0: {
      serializableCheck: boolean;
    }) => string | unknown[]
  ) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware({ serializableCheck: false }).concat(
          thunk as ThunkMiddleware
        )
      : getDefaultMiddleware({ serializableCheck: false }).concat(
          thunk as ThunkMiddleware
        ),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
