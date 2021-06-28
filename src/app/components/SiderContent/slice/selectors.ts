import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.sider || initialState;

export const selectIsSiderToggled = createSelector(
  [selectDomain],
  siderState => siderState.isToggled,
);