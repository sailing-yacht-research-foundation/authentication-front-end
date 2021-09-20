import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.course || initialState;

export const selectCourseSequencedGeometries = createSelector(
    [selectDomain],
    courseState => courseState.course_sequenced_geometries,
);