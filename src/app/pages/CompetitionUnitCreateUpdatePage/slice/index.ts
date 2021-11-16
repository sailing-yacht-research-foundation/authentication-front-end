import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { competitionUnitManagerState } from './types';

export const initialState: competitionUnitManagerState = {
    lastSubscribedCompetitionUnitId: ''
};

const slice = createSlice({
  name: 'competitionUnitManager',
  initialState,
  reducers: {
    setLastSubscribedCompetitionUnitId(state, action: PayloadAction<string>) {
      state.lastSubscribedCompetitionUnitId = action.payload;
    }
  },
});

export const { actions: courseActions, reducer } = slice;

export const useCompetitionUnitManagerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
