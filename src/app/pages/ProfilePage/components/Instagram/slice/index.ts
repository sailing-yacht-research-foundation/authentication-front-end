import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import instagramSaga from './saga';
import { InstagramState } from './types';

export const initialState: InstagramState = {
  posts: [],
  isConnected: false
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
    }
  },
});

export const { actions: instagramActions, reducer } = slice;

export const useInstagramSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: instagramSaga });
  return { actions: slice.actions };
};
