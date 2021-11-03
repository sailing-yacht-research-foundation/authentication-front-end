import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import loginSaga from './saga';
import { LoginState, Coordinate } from './types';

export const initialState: LoginState = {
  user: {},
  is_authenticated: !!localStorage.getItem('session_token') && !localStorage.getItem('is_guest'),
  session_token: !!localStorage.getItem('session_token') ? String(localStorage.getItem('session_token')) : '',
  syrf_authenticated: !!localStorage.getItem('session_token') && !!localStorage.getItem('is_guest'),
  user_coordinate: JSON.parse(localStorage.getItem('user_coordinate') || 'null'),
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    setSessionToken(state, action: PayloadAction<string>) {
      state.session_token = action.payload;
      localStorage.setItem('session_token', action.payload);
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.is_authenticated = action.payload;
    },
    setUserCoordinate(state, action: PayloadAction<null | Coordinate>) {
      state.user_coordinate = action.payload;
      localStorage.setItem('user_coordinate', JSON.stringify(action.payload));
    },
    setLogout(state) {
      state.is_authenticated = false;
      state.session_token = '';
      state.user = {};
      localStorage.removeItem('user');
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_coordinate');
    },
    getUser() {},
    syrfServiceAnonymousLogin() {},
    setSYRFServiceAuthorized(state, action: PayloadAction<boolean>) {
      state.syrf_authenticated = action.payload;
    }
  },
});

export const { actions: loginActions, reducer } = slice;

export const UseLoginSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: loginSaga });
  return { actions: slice.actions };
};
