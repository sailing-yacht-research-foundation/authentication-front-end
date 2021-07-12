import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { facebookSaga } from './saga';
import { FacebookState } from './types';

export const initialState: FacebookState = {
  posts: [],
  isConnected: false,
  getFeedError: false,
  exchangeTokenError: false
};

const slice = createSlice({
  name: 'facebook',
  initialState,
  reducers: {
    getPosts() { },
    setPosts(state, action: PayloadAction<object[]>) {
      state.posts = action.payload;
    },
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setGetFeedsErrorState(state, action: PayloadAction<boolean>) {
      state.getFeedError = action.payload;
    },
    setExchangeTokenErrorState(state, action: PayloadAction<boolean>) {
      state.exchangeTokenError = action.payload;
    },
    exchangeToken(state, action: PayloadAction<string>) { }
  },
});

export const { actions: facebookActions, reducer } = slice;

export const useFacebookSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: facebookSaga });
  return { actions: slice.actions };
};
