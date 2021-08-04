import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import eulaSaga from './saga';
import { EULAState } from './types';

export const initialState: EULAState = {
};

const slice = createSlice({
  name: 'eula',
  initialState,
  reducers: {
    signEulaVersion(state, action: PayloadAction<string>) {}
  },
});

export const { actions: eulaActions, reducer } = slice;

export const useEulaSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: eulaSaga });
  return { actions: slice.actions };
};
