import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.competitionUnitManager || initialState;

export const selectLastSubscribedCompetitionUnitId = createSelector(
    [selectDomain],
    state => state.lastSubscribedCompetitionUnitId,
);