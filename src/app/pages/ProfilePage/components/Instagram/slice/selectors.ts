import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.facebook || initialState;

export const selectPosts = createSelector(
  [selectDomain],
  instagramState => instagramState.posts,
);

export const selectIsConnected = createSelector(
  [selectDomain],
  instagramState => instagramState.isConnected,
);