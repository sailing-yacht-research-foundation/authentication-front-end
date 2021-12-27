import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.profileSearch || initialState;

export const selectResults = createSelector(
    [selectDomain],
    siderState => siderState.results,
);

export const selectIsSearching = createSelector(
    [selectDomain],
    siderState => siderState.isSearching,
);