import * as slice from '..';
import { ContainerState } from '../types';

describe('GroupList slice', () => {
    let state: ContainerState;

    beforeEach(() => {
        state = slice.initialState;
    });

    it('should return the initial state', () => {
        expect(slice.reducer(undefined, { type: '' })).toEqual(state);
    });

    it('should handle setGroups', () => {
        const groups = [];
        expect(
            slice.reducer(state, slice.groupActions.setGroups(groups)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groups: [],
        });
    });

    it('should handle setCurrentGroupPage', () => {
        const page = 1;
        expect(
            slice.reducer(state, slice.groupActions.setCurrentGroupPage(page)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupCurrentPage: page
        });
    });

    it('should handle setGroupPageSize', () => {
        const pageSize = 10;
        expect(
            slice.reducer(state, slice.groupActions.setGroupPageSize(pageSize)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupPageSize: pageSize
        });
    });

    it('should handle setGroupTotalPage', () => {
        const groupsTotalPage = 1000;
        expect(
            slice.reducer(state, slice.groupActions.setGroupTotalPage(groupsTotalPage)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupTotalPage: groupsTotalPage
        });
    });

    it('should handle setInvitations', () => {
        const invitations = [];
        expect(
            slice.reducer(state, slice.groupActions.setInvitations(invitations)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            invitations: invitations
        });
    });

    it('should handle setInvitationTotalPage', () => {
        const invitationTotalpage = 1023;
        expect(
            slice.reducer(state, slice.groupActions.setInvitationTotalPage(invitationTotalpage)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            invitationsTotalPage: invitationTotalpage
        });
    });

    it('should handle setGroupInvitationPageSize', () => {
        const invitationPageSize = 123;
        expect(
            slice.reducer(state, slice.groupActions.setGroupInvitationPageSize(invitationPageSize)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            invitationPageSize: invitationPageSize
        });
    });

    it('should handle setCurrentInvitationPage', () => {
        const currentInvitationsPage = 12;
        expect(
            slice.reducer(state, slice.groupActions.setCurrentInvitationPage(currentInvitationsPage)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            invitationsCurrentPage: currentInvitationsPage
        });
    });

    it('should handle setGroupSearchPageSize', () => {
        const groupSearchResultsPageSize = 10;
        expect(
            slice.reducer(state, slice.groupActions.setGroupSearchPageSize(groupSearchResultsPageSize)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupSearchPageSize: groupSearchResultsPageSize
        });
    });

    it('should handle setSearchCurrentPage', () => {
        const currentPage = 5;
        expect(
            slice.reducer(state, slice.groupActions.setSearchCurrentPage(currentPage)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupSearchCurrentPage: currentPage
        });
    });

    it('should handle setSearchKeyword', () => {
        const keyword = 'jonathan';
        expect(
            slice.reducer(state, slice.groupActions.setSearchKeyword(keyword)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            searchKeyword: keyword
        });
    });

    it('should handle setSearchResults', () => {
        const results = [];
        expect(
            slice.reducer(state, slice.groupActions.setSearchResults(results)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupResults: results
        });
    });

    it('should handle setSearchTotalPage', () => {
        const totalPages = 202;
        expect(
            slice.reducer(state, slice.groupActions.setSearchTotalPage(totalPages)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            groupSearchTotalPage: totalPages
        });
    });

    it('should handle setPerformedSearch', () => {
        const performedSearch = true;
        expect(
            slice.reducer(state, slice.groupActions.setPerformedSearch(performedSearch)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            performedSearch: performedSearch
        });
    });
});
