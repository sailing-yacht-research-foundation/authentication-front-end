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
  homeState => homeState.isSearching,
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
  homeState => homeState.fromDate,
); 

export const selectToDate = createSelector(
  [selectDomain],
  homeState => homeState.toDate,
);

export const selectPageSize = createSelector(
  [selectDomain],
  homeState => homeState.pageSize,
);

export const selectShowAdvancedSearch = createSelector(
  [selectDomain],
  homeState => homeState.showAdvancedSearch,
);

export const selectSortType = createSelector(
  [selectDomain],
  homeState => homeState.sort,
);

export const selectUpcomingRaces = createSelector(
  [selectDomain],
  homeState => homeState.upcomingResults,
);

export const selectUpcomingRacePage = createSelector(
  [selectDomain],
  homeState => homeState.upcomingResultPage,
);

export const selectUpcomingRacePageSize = createSelector(
  [selectDomain],
  homeState => homeState.upcomingResultSize,
);

export const selectUpcomingRaceTotal = createSelector(
  [selectDomain],
  homeState => homeState.upcomingResultTotal,
);

export const selectUpcomingRaceDistanceCriteria = createSelector(
  [selectDomain],
  homeState => homeState.upcomingResultDistance,
);

export const selectUpcomingRaceDurationCriteria = createSelector(
  [selectDomain],
  homeState => homeState.upcomingResultDuration,
);

export const selectNoResultsFound = createSelector(
  [selectDomain],
  homeState => homeState.noResultFound,
);

export const selectRelations = createSelector(
  [selectDomain],
  homeState => homeState.relations,
);