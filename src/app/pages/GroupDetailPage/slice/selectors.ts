import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.groupDetail || initialState;

export const selectMembers = createSelector(
    [selectDomain],
    group => group.members,
);

export const selectAdmins = createSelector(
    [selectDomain],
    group => group.admins,
);

export const selectTotalAdmins = createSelector(
    [selectDomain],
    group => group.adminTotal,
);

export const selecTotalMembers = createSelector(
    [selectDomain],
    group => group.memberTotal,
);

export const selectAdminCurrentPage = createSelector(
    [selectDomain],
    group => group.adminCurrentPage,
);

export const selectMemberCurrentPage = createSelector(
    [selectDomain],
    group => group.memberCurrentPage,
);

export const selectIsGettingMembers = createSelector(
    [selectDomain],
    group => group.isGettingMembers,
);

export const selectIsGettingAdmins = createSelector(
    [selectDomain],
    group => group.isGettingAdmins,
);

export const selectGroupDetail = createSelector(
    [selectDomain],
    group => group.group,
);

export const selectIsGettingGroup = createSelector(
    [selectDomain],
    group => group.isGettingGroup,
);

export const selectGetGroupFailed = createSelector(
    [selectDomain],
    group => group.getGroupDetailFailed,
);

export const selectAcceptedMemberResults = createSelector(
    [selectDomain],
    group => group.acceptedMemberResults,
);