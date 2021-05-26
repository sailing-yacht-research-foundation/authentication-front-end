import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { LoginSaga } from './saga';
import { LoginState } from './types';
import { CognitoUser } from 'amazon-cognito-identity-js';

export const initialState: LoginState = {
  user: {},
  isAuthenticated: !!localStorage.getItem('access_token'),
  access_token: !!localStorage.getItem('access_token') ? String(localStorage.getItem('access_token')) : ''
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CognitoUser>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.access_token = action.payload;
      localStorage.setItem('access_token', action.payload);
    },
    setIsAuthenticated(state, action: PayloadAction<Boolean>) {
      state.isAuthenticated = action.payload;
    },
    setLogout(state) {
      state.isAuthenticated = false;
      state.access_token = '';
      localStorage.removeItem('access_token');
    }
  },
});

export const { actions: loginActions, reducer } = slice;

export const UseLoginSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: LoginSaga });
  return { actions: slice.actions };
};
