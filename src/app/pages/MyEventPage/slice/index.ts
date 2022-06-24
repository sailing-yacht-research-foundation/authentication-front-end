import { PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent } from 'types/CalendarEvent';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import myEventListSaga from './saga';
import { MyEventListState } from './types';

export const initialState: MyEventListState = {
  page: 1,
  results: [],
  total: 0,
  is_changing_page: false,
  size: 10,
  keyword: '',
};

const slice = createSlice({
  name: 'myEventList',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<CalendarEvent[]>) {
      state.results = action.payload;
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    getEvents(state, action: PayloadAction<any>) { },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
    },
    setIsChangingPage(state, action: PayloadAction<boolean>) {
      state.is_changing_page = action.payload;
    },
    clearEventsListData(state) {
      state.results = [];
      state.page = 1;
      state.total = 0;
    },
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    }
  },
});

export const { actions: myEventListActions, reducer } = slice;

export const useMyEventListSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: myEventListSaga });
  return { actions: slice.actions };
};
