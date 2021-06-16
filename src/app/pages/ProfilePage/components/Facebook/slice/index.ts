import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import facebookSaga from './saga';
import { FacebookState } from './types';

export const initialState: FacebookState = {
  posts: [],
  isConnected: false,
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
    }
  },
});

export const { actions: facebookActions, reducer } = slice;

export const useFacebookSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: facebookSaga });
  return { actions: slice.actions };
};
