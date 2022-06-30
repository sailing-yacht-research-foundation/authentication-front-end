import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('GroupList selectors', () => {
    let state: RootState;

    beforeEach(() => {
        state = {};
    });

    it('should selectMembers', () => {
        const members = [];
        state = {
            groupDetail: { ...initialState, members: [] },
        };
        expect(selectors.selectMembers(state)).toEqual(members);
    });


    it('should handle selectAdmins', () => {
        const admins = [];
        state = {
            groupDetail: { ...initialState, admins: admins },
        };
        expect(selectors.selectAdmins(state)).toEqual(admins);
    });

    it('should handle selectTotalAdmins', () => {
        const totalAdmins = 6;
        state = {
            groupDetail: { ...initialState, adminTotal: totalAdmins },
        };
        expect(selectors.selectTotalAdmins(state)).toEqual(totalAdmins);
    });

    it('should handle selecTotalMembers', () => {
        const totalMembers = 2034;
        state = {
            groupDetail: { ...initialState, memberTotal: totalMembers },
        };
        expect(selectors.selecTotalMembers(state)).toEqual(totalMembers);
    });

    it('should handle selectAdminCurrentPage', () => {
        const currentPage = 5;
        state = {
            groupDetail: { ...initialState, adminCurrentPage: currentPage },
        };
        expect(selectors.selectAdminCurrentPage(state)).toEqual(currentPage);
    });

    it('should handle selectMemberCurrentPage', () => {
        const currentPage = 5;
        state = {
            groupDetail: { ...initialState, memberCurrentPage: currentPage },
        };
        expect(selectors.selectMemberCurrentPage(state)).toEqual(currentPage);
    });

    it('should handle selectIsGettingMembers', () => {
        const isGettingMembers = true;
        state = {
            groupDetail: { ...initialState, isGettingMembers: isGettingMembers },
        };
        expect(selectors.selectIsGettingMembers(state)).toEqual(isGettingMembers);
    });

    it('should handle selectIsGettingAdmins', () => {
        const isGettingAdmins = false;
        state = {
            groupDetail: { ...initialState, isGettingAdmins: isGettingAdmins },
        };
        expect(selectors.selectIsGettingAdmins(state)).toEqual(isGettingAdmins);
    });

    it('should handle selectGroupDetail', () => {
        const group = {};
        state = {
            groupDetail: { ...initialState, group: group },
        };
        expect(selectors.selectGroupDetail(state)).toEqual(group);
    });

    it('should handle selectIsGettingGroup', () => {
        const isGettingGroup = false;
        state = {
            groupDetail: { ...initialState, isGettingGroup: isGettingGroup },
        };
        expect(selectors.selectIsGettingGroup(state)).toEqual(isGettingGroup);
    });

    it('should handle selectIsGetGroupFailed', () => {
        const getGroupFailed = true;
        state = {
            groupDetail: { ...initialState, isGetGroupDetailFailed: getGroupFailed },
        };
        expect(selectors.selectIsGetGroupFailed(state)).toEqual(getGroupFailed);
    });

    it('should handle selectAcceptedMemberResults', () => {
        const acceptedMembers = [];
        state = {
            groupDetail: { ...initialState, acceptedMemberResults: acceptedMembers },
        };
        expect(selectors.selectAcceptedMemberResults(state)).toEqual(acceptedMembers);
    });

    it('should handle selectMemberPageSize', () => {
        const size = 20;
        state = {
            groupDetail: { ...initialState, memberPageSize: size },
        };
        expect(selectors.selectMemberPageSize(state)).toEqual(size);
    });

    it('should handle selectAdminPageSize', () => {
        const size = 24;
        state = {
            groupDetail: { ...initialState, adminPageSize: size },
        };
        expect(selectors.selectAdminPageSize(state)).toEqual(size);
    });
});
