import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.playback || initialState;

export const selectElapsedTime = createSelector(
  [selectDomain],
  playbackState => playbackState.elapsedTime,
);

export const selectRaceLength = createSelector(
  [selectDomain],
  loginState => loginState.raceLength,
);