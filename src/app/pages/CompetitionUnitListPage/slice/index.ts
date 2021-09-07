import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import myRaceListSaga from './saga';
import { MyRaceListState } from './types';

export const initialState: MyRaceListState = {
  page: 1,
  results: [],
  total: 0,
  is_changing_page: false,
};

const slice = createSlice({
  name: 'myRaceList',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<any[]>) {
      state.results = action.payload;
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    getRaces(state, page) { },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setIsChangingPage(state, action: PayloadAction<boolean>) {
      state.is_changing_page = action.payload;
    }
  },
});

export const { actions: myRaceListActions, reducer } = slice;

export const useMyRaceListSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: myRaceListSaga });
  return { actions: slice.actions };
};
