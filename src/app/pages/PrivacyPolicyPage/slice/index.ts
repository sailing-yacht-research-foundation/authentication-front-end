import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import privacyPolicySaga from './saga';
import { PrivacyPolicyState } from './types';

export const initialState: PrivacyPolicyState = {
};

const slice = createSlice({
  name: 'privacyPolicy',
  initialState,
  reducers: {
   signPolicyVersion(state, action: PayloadAction<string>) {}
  },
});

export const { actions: privacyPolicyActions, reducer } = slice;

export const usePrivacyPolicySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: privacyPolicySaga });
  return { actions: slice.actions };
};
