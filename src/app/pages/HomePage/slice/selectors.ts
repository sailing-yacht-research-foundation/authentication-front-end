import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.home || initialState;

export const selectResults = createSelector(
  [selectDomain],
  homeState => homeState.results,
);

export const selectSearchKeyword = createSelector(
  [selectDomain],
  homeState => homeState.keyword,
);

export const selectIsSearching = createSelector(
  [selectDomain],
  homeState => homeState.is_searching,
);

export const selectTotal = createSelector(
  [selectDomain],
  homeState => homeState.total,
);

export const selectPage = createSelector(
  [selectDomain],
  homeState => homeState.page,
); 

export const selectFromDate = createSelector(
  [selectDomain],
  homeState => homeState.from_date,
); 

export const selectToDate = createSelector(
  [selectDomain],
  homeState => homeState.to_date,
);

export const selectPageSize = createSelector(
  [selectDomain],
  homeState => homeState.page_size,
);

export const selectShowAdvancedSearch = createSelector(
  [selectDomain],
  homeState => homeState.show_advanced_search,
);