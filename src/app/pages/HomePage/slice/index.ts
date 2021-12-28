import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import homeSaga from './saga';
import { HomeState } from './types';

export const initialState: HomeState = {
 from_date: '',
 to_date: '',
 keyword: '',
 results: [],
 page: 1,
 total: 0,
 is_searching: false,
 page_size: 10,
 show_advanced_search: false,
 sort: 'desc'
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
      state.is_searching = action.payload;
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setFromDate(state, action: PayloadAction<string>) {
      state.from_date = action.payload;
    },
    setToDate(state, action: PayloadAction<string>) {
      state.to_date = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.page_size = action.payload;
    },
    setShowAdvancedSearch(state, action: PayloadAction<boolean>) {
      state.show_advanced_search = action.payload;
    },
    setSortType(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    }
  },
});

export const { actions: homeActions, reducer } = slice;

export const useHomeSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: homeSaga });
  return { actions: slice.actions };
};
