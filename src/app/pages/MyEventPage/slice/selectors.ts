import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.myEventList || initialState;

export const selectResults = createSelector(
    [selectDomain],
    myEventList => myEventList.results,
);

export const selectTotal = createSelector(
    [selectDomain],
    myEventList => myEventList.total,
);

export const selectPage = createSelector(
    [selectDomain],
    myEventList => myEventList.page,
);

export const selectIsChangingPage = createSelector(
    [selectDomain],
    myEventList => myEventList.is_changing_page,
);

export const selectPageSize = createSelector(
    [selectDomain],
    myEventList => myEventList.size,
);

export const selectFilter = createSelector(
    [selectDomain],
    myEventList => myEventList.filter
);