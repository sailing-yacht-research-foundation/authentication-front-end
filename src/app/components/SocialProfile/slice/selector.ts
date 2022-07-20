import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

export const selectShowFollowRequestModal = createSelector(
  [(state: RootState) => state.social || initialState],
  socialState => socialState.showFollowRequestModal,
);

export const selectPagination = createSelector(
  [(state: RootState) => state.social || initialState],
  socialState => socialState.pagination,
);
