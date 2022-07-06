import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.track || initialState;

export const selectPagination = createSelector(
    [selectDomain],
    track => track.pagination,
);

export const selectIsDeletingTrack = createSelector(
    [selectDomain],
    track => track.isDeletingTrack,
);

export const selectIsLoading = createSelector(
    [selectDomain],
    track => track.isLoading,
);

export const selectSorter = createSelector(
    [selectDomain],
    track => track.sorter,
);

export const selectFilter = createSelector(
    [selectDomain],
    track => track.filter,
);