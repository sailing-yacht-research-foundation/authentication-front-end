import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.myRaceList || initialState;

export const selectResults = createSelector(
    [selectDomain],
    myRaceList => myRaceList.results,
);

export const selectTotal = createSelector(
    [selectDomain],
    myRaceList => myRaceList.total,
);

export const selectPage = createSelector(
    [selectDomain],
    myRaceList => myRaceList.page,
);

export const selectIsChangingPage = createSelector(
    [selectDomain],
    myRaceList => myRaceList.is_changing_page,
);