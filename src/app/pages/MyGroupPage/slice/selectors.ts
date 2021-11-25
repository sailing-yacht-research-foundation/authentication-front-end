import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.group || initialState;

export const selectGroups = createSelector(
    [selectDomain],
    group => group.groups,
);

export const selectInvitations = createSelector(
    [selectDomain],
    group => group.invitations,
);

export const selectIsChangingPage = createSelector(
    [selectDomain],
    group => group.isChangingPage,
);

export const selectGroupCurrentPage = createSelector(
    [selectDomain],
    group => group.groupCurrentPage,
);

export const selectGroupTotalPage = createSelector(
    [selectDomain],
    group => group.groupTotalPage,
);

export const selectInvitationCurrentPage = createSelector(
    [selectDomain],
    group => group.invitationsCurrentPage,
);

export const selectInvitationTotalPage = createSelector(
    [selectDomain],
    group => group.invitationsTotalPage,
);

export const selectIsLoading = createSelector(
    [selectDomain],
    group => group.isLoading,
);

export const selectSearchResults = createSelector(
    [selectDomain],
    group => group.groupResults,
);

export const selectSearchCurrentPage = createSelector(
    [selectDomain],
    group => group.groupSearchCurrentPage,
);

export const selectSearchTotalPage = createSelector(
    [selectDomain],
    group => group.groupSearchTotalPage,
);

export const selectSearchKeyword = createSelector(
    [selectDomain],
    group => group.searchKeyword,
);

export const selectRequestedGroups = createSelector(
    [selectDomain],
    group => group.requestedGroups,
);

export const selectRequestedGroupTotalPage = createSelector(
    [selectDomain],
    group => group.requestedGroupTotalPage,
);

export const selectRequestedGroupCurrentPage = createSelector(
    [selectDomain],
    group => group.requestedGroupsCurrentPage,
);

export const selectIsGettingRequestedGroups = createSelector(
    [selectDomain],
    group => group.isGettingRequestedGroups,
);

export const selectIsModalLoading = createSelector(
    [selectDomain],
    group => group.isModalLoading,
);