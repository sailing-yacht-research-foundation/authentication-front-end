import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { instagramSaga } from './saga';
import { InstagramState } from './types';

export const initialState: InstagramState = {
  posts: [],
  isConnected: false,
  exchangeTokenError: false,
  getFeedError: false
};

const slice = createSlice({
  name: 'instagram',
  initialState,
  reducers: {
    getPosts() {},
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
    exchangeTokenFromCode(state, action: PayloadAction<string>) { },
    exchangeLongLivedToken(state, action: PayloadAction<string>) {},
  },
});

export const { actions: instagramActions, reducer } = slice;

export const useInstagramSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: instagramSaga });
  return { actions: slice.actions };
};
