import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.vesselList || initialState;

export const selectPagination = createSelector(
    [selectDomain],
    vesselList => vesselList.pagination,
);

export const selectIsLoading = createSelector(
    [selectDomain],
    vesselList => vesselList.isLoading,
);

export const selectSorter = createSelector(
    [selectDomain],
    vesselList => vesselList.sorter,
);

export const selectFilter = createSelector(
    [selectDomain],
    vesselList => vesselList.filter,
);
