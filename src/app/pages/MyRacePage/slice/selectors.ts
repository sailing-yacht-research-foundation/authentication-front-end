import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.myRaceList || initialState;

export const selectResults = createSelector(
    [selectDomain],
    homeState => homeState.results,
);

export const selectTotal = createSelector(
    [selectDomain],
    homeState => homeState.total,
);

export const selectPage = createSelector(
    [selectDomain],
    homeState => homeState.page,
);