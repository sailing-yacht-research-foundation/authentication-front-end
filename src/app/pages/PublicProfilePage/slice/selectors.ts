import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.publicProfile || initialState;

export const selectProfile = createSelector(
  [selectDomain],
  siderState => siderState.profile,
);

export const selectFollowers = createSelector(
  [selectDomain],
  siderState => siderState.followers,
);

export const selectFollowing = createSelector(
  [selectDomain],
  siderState => siderState.following,
);

export const selectEvents = createSelector(
  [selectDomain],
  siderState => siderState.events,
);

export const selectFollowerCurrentPage = createSelector(
  [selectDomain],
  siderState => siderState.currentFollowerPage,
);

export const selectFollowingCurrentPage = createSelector(
  [selectDomain],
  siderState => siderState.currentFollowingPage,
);

export const selectFollowerTotalRecords = createSelector(
  [selectDomain],
  siderState => siderState.followerTotalRecords,
);

export const selectFollowingTotalRecords = createSelector(
  [selectDomain],
  siderState => siderState.followingTotalRecords,
);

export const selectFollowerTotalPage = createSelector(
  [selectDomain],
  siderState => siderState.followerTotalPage,
);

export const selectFollowingTotalPage = createSelector(
  [selectDomain],
  siderState => siderState.followingTotalPage,
);

export const selectModalLoading = createSelector(
  [selectDomain],
  siderState => siderState.isModalLoading,
);

export const selectGetProfileFailed = createSelector(
  [selectDomain],
  siderState => siderState.getProfileFailed,
);

export const selectIsLoadingProfile = createSelector(
  [selectDomain],
  siderState => siderState.isLoadingProfile,
);

export const selectFollowerPageSize = createSelector(
  [selectDomain],
  siderState => siderState.followerPageSize,
);

export const selectFollowingPageSize = createSelector(
  [selectDomain],
  siderState => siderState.followingPageSize,
);
