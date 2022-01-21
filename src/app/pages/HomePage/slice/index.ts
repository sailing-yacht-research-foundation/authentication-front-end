import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import homeSaga from './saga';
import { HomeState } from './types';

export const initialState: HomeState = {
 fromDate: '',
 toDate: '',
 keyword: '',
 results: [],
 page: 1,
 total: 0,
 isSearching: false,
 pageSize: 10,
 showAdvancedSearch: false,
 sort: 'desc',
 noResultFound: false,
 upcomingResults: [],
 upcomingResultPage: 1,
 upcomingResultSize: 10,
 upcomingResultTotal: 0,
 upcomingResultDistance: 5, // miles
 upcomingResultDuration: 2, // month,
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<any[]>) {
        state.results = action.payload;
    },
    searchRaces(state, action: PayloadAction<any>) {},
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    setIsSearching(state, action: PayloadAction<any>) {
      state.isSearching = action.payload;
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setFromDate(state, action: PayloadAction<string>) {
      state.fromDate = action.payload;
    },
    setToDate(state, action: PayloadAction<string>) {
      state.toDate = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setShowAdvancedSearch(state, action: PayloadAction<boolean>) {
      state.showAdvancedSearch = action.payload;
    },
    setSortType(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    setUpcomingRaceResults(state, action: PayloadAction<any[]>) {
      state.upcomingResults = action.payload;
    },
    setUpComingResultPage(state, action: PayloadAction<number>) {
      state.upcomingResultPage = action.payload;
    },
    setUpcomingResultPageSize(state, action: PayloadAction<number>) {
      state.upcomingResultSize = action.payload;
    },
    setUpcomingResultTotal(state, action: PayloadAction<number>) {
      state.upcomingResultTotal = action.payload;
    },
    setUpcomingResultDistance(state, action: PayloadAction<number>) {
      state.upcomingResultDistance = action.payload;
    },
    setUpcomingResultDuration(state, action: PayloadAction<number>) {
      state.upcomingResultDuration = action.payload;
    },
    getLiveAndUpcomingRaces(state, action: PayloadAction<any>) {},
    setNoResultsFound(state, action: PayloadAction<boolean>) {
      state.noResultFound = action.payload;
    }
  },
});

export const { actions: homeActions, reducer } = slice;

export const useHomeSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: homeSaga });
  return { actions: slice.actions };
};
