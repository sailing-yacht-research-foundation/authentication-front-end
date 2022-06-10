import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('GroupList selectors', () => {
    let state: RootState;

    beforeEach(() => {
        state = {};
    });

    it('should select groups', () => {
        const groups = [];
        state = {
            group: { ...initialState, groups: [] },
        };
        expect(selectors.selectGroups(state)).toEqual(groups);
    });


    it('should handle selectIsChangingPage', () => {
        const isChangingPage = true;
        state = {
            group: { ...initialState, isChangingPage: isChangingPage },
        };
        expect(selectors.selectIsChangingPage(state)).toEqual(isChangingPage);
    });

    it('should handle selectGroupCurrentPage', () => {
        const groupCurrentPage = 1;
        state = {
            group: { ...initialState, groupCurrentPage: groupCurrentPage },
        };
        expect(selectors.selectGroupCurrentPage(state)).toEqual(groupCurrentPage);
    });

    it('should handle selectGroupTotalPage', () => {
        const groupTotalPage = 20;
        state = {
            group: { ...initialState, groupTotalPage: groupTotalPage },
        };
        expect(selectors.selectGroupTotalPage(state)).toEqual(groupTotalPage);
    });

    it('should handle selectInvitationCurrentPage', () => {
        const currentPage = 5;
        state = {
            group: { ...initialState, invitationsCurrentPage: currentPage },
        };
        expect(selectors.selectInvitationCurrentPage(state)).toEqual(currentPage);
    });

    it('should handle selectInvitationTotalPage', () => {
        const totalPage = 5;
        state = {
            group: { ...initialState, invitationsTotalPage: totalPage },
        };
        expect(selectors.selectInvitationTotalPage(state)).toEqual(totalPage);
    });

    it('should handle selectIsLoading', () => {
        const isLoading = true;
        state = {
            group: { ...initialState, isLoading: isLoading },
        };
        expect(selectors.selectIsLoading(state)).toEqual(isLoading);
    });

    it('should handle selectSearchResults', () => {
        const totalResults = [];
        state = {
            group: { ...initialState, groupResults: totalResults },
        };
        expect(selectors.selectSearchResults(state)).toEqual(totalResults);
    });

    it('should handle selectSearchCurrentPage', () => {
        const currentPage = 1;
        state = {
            group: { ...initialState, groupSearchCurrentPage: currentPage },
        };
        expect(selectors.selectSearchCurrentPage(state)).toEqual(currentPage);
    });

    it('should handle selectSearchTotalPage', () => {
        const totalPage = 10;
        state = {
            group: { ...initialState, groupSearchTotalPage: 10 },
        };
        expect(selectors.selectSearchTotalPage(state)).toEqual(totalPage);
    });

    it('should handle selectSearchKeyword', () => {
        const keyword = 'hey!!';
        state = {
            group: { ...initialState, searchKeyword: keyword },
        };
        expect(selectors.selectSearchKeyword(state)).toEqual(keyword);
    });

    it('should handle selectRequestedGroupTotalPage', () => {
        const totalPage = 21;
        state = {
            group: { ...initialState, requestedGroupTotalPage: totalPage },
        };
        expect(selectors.selectRequestedGroupTotalPage(state)).toEqual(totalPage);
    });

    it('should handle selectRequestedGroupCurrentPage', () => {
        const currentPage = 2;
        state = {
            group: { ...initialState, requestedGroupsCurrentPage: currentPage },
        };
        expect(selectors.selectRequestedGroupCurrentPage(state)).toEqual(currentPage);
    });

    it('should handle selectIsGettingRequestedGroups', () => {
        const isGettingRequestedGroups = true;
        state = {
            group: { ...initialState, isGettingRequestedGroups: isGettingRequestedGroups },
        };
        expect(selectors.selectIsGettingRequestedGroups(state)).toEqual(isGettingRequestedGroups);
    });

    it('should handle selectIsModalLoading', () => {
        const isLoading = true;
        state = {
            group: { ...initialState, isModalLoading: isLoading },
        };
        expect(selectors.selectIsModalLoading(state)).toEqual(isLoading);
    });

    it('should handle selectPerformedSearch', () => {
        const performedSearch = true;
        state = {
            group: { ...initialState, performedSearch: performedSearch },
        };
        expect(selectors.selectPerformedSearch(state)).toEqual(performedSearch);
    });

    it('should handle selectGroupPageSize', () => {
        const pageSize = 20;
        state = {
            group: { ...initialState, groupPageSize: pageSize },
        };
        expect(selectors.selectGroupPageSize(state)).toEqual(pageSize);
    });

    it('should handle selectGroupSearchPageSize', () => {
        const pageSize = 20;
        state = {
            group: { ...initialState, groupSearchPageSize: pageSize },
        };
        expect(selectors.selectGroupSearchPageSize(state)).toEqual(pageSize);
    });

    it('should handle selectInvitationPageSize', () => {
        const pageSize = 20;
        state = {
            group: { ...initialState, invitationPageSize: pageSize },
        };
        expect(selectors.selectInvitationPageSize(state)).toEqual(pageSize);
    });

    it('should handle selectRequestedGroupPageSize', () => {
        const pageSize = 20;
        state = {
            group: { ...initialState, requestedGroupPageSize: pageSize },
        };
        expect(selectors.selectRequestedGroupPageSize(state)).toEqual(pageSize);
    });
});
