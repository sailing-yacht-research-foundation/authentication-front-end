import { GroupMember } from 'types/Group';
import * as slice from '..';
import { ContainerState } from '../types';

describe('GroupDetail slice', () => {
    let state: ContainerState;

    beforeEach(() => {
        state = slice.initialState;
    });

    it('should return the initial state', () => {
        expect(slice.reducer(undefined, { type: '' })).toEqual(state);
    });

    it('should handle setAdmins', () => {
        const admins: GroupMember[] = [];
        expect(
            slice.reducer(state, slice.groupDetailActions.setAdmins(admins)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            admins: [],
        });
    });

    it('should handle setMembers', () => {
        const admins: GroupMember[] = [];
        expect(
            slice.reducer(state, slice.groupDetailActions.setMembers(admins)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            members: [],
        });
    });

    it('should handle setCurrentMemberPage', () => {
        const page = 10;
        expect(
            slice.reducer(state, slice.groupDetailActions.setCurrentMemberPage(page)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            memberCurrentPage: page
        });
    });

    it('should handle setCurrentAdminPage', () => {
        const page = 10;
        expect(
            slice.reducer(state, slice.groupDetailActions.setCurrentAdminPage(page)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            adminCurrentPage: page
        });
    });

    it('should handle setAdminTotal', () => {
        const total = 1022;
        expect(
            slice.reducer(state, slice.groupDetailActions.setAdminTotal(total)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            adminTotal: total
        });
    });

    it('should handle setMemberTotal', () => {
        const total = 1022;
        expect(
            slice.reducer(state, slice.groupDetailActions.setMemberTotal(total)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            memberTotal: total
        });
    });

    it('should handle setIsGettingAdmins', () => {
        const isGettingAdmins = true;
        expect(
            slice.reducer(state, slice.groupDetailActions.setIsGettingAdmins(isGettingAdmins)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            isGettingAdmins: isGettingAdmins
        });
    });

    it('should handle setIsGettingMembers', () => {
        const isGettingMembers = true;
        expect(
            slice.reducer(state, slice.groupDetailActions.setIsGettingMembers(isGettingMembers)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            isGettingMembers: isGettingMembers
        });
    });


    it('should handle setGroup', () => {
        const group = {};
        expect(
            slice.reducer(state, slice.groupDetailActions.setGroup(group)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            group: group
        });
    });

    it('should handle setIsGetGroupFailed', () => {
        const isGetGroupFailed = true;
        expect(
            slice.reducer(state, slice.groupDetailActions.setIsGetGroupFailed(isGetGroupFailed)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            isGetGroupDetailFailed: isGetGroupFailed
        });
    });
   

    it('should handle setIsGettingGroup', () => {
        const isGettingGroup = true;
        expect(
            slice.reducer(state, slice.groupDetailActions.setIsGettingGroup(isGettingGroup)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            isGettingGroup: isGettingGroup
        });
    });

    it('should handle setAcceptedMemberResults', () => {
        const results = [];
        expect(
            slice.reducer(state, slice.groupDetailActions.setAcceptedMemberResults(results)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            acceptedMemberResults: results
        });
    });

    it('should handle setMemberPageSize', () => {
        const pageSize = 26;
        expect(
            slice.reducer(state, slice.groupDetailActions.setMemberPageSize(pageSize)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            memberPageSize: pageSize
        });
    });

    it('should handle setAdminPageSize', () => {
        const pageSize = 245;
        expect(
            slice.reducer(state, slice.groupDetailActions.setAdminPageSize(pageSize)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            adminPageSize: pageSize
        });
    });
});
