import { put, takeLatest, call } from 'redux-saga/effects';
import { getGroupInvitations, getMyGroups, searchGroups } from 'services/live-data-server/groups';
import { GroupMemberStatus } from 'utils/constants';
import * as slice from '..';

import groupsListSaga, { getGroups, getInvitations, getRequestedGroups, searchForGroups } from '../saga';

describe('groups list Saga', () => {
    let getGroupsIterator: ReturnType<typeof getGroups>;
    let getInvitationsIterator: ReturnType<typeof getInvitations>;
    let getRequestedGroupsIterator: ReturnType<typeof getRequestedGroups>;
    let searchForGroupsIterator: ReturnType<typeof searchForGroups>;
    const getGroupsParam: any = { page: 1, size: 10 };
    const getInvitationsParam: any = { page: 1, size: 10, invitationType: GroupMemberStatus.INVITED };
    const getRequestedGroupsParam: any = { page: 1, size: 10, invitationType: GroupMemberStatus.REQUESTED };
    const searchGroupsParam: any = { keyword: 'hey!!', page: 1, size: 10 };

    // We have to test twice, once for a successful load and once for an unsuccessful one
    // so we do all the stuff that happens beforehand automatically in the beforeEach
    beforeEach(() => {
        getGroupsIterator = getGroups({
            type: slice.groupActions.getGroups.type,
            payload: getGroupsParam
        });
        getInvitationsIterator = getInvitations({
            type: slice.groupActions.getGroupInvitations.type,
            payload: getInvitationsParam
        });
        getRequestedGroupsIterator = getRequestedGroups({
            type: slice.groupActions.getRequestedGroups.type,
            payload: getRequestedGroupsParam
        });
        searchForGroupsIterator = searchForGroups({
            type: slice.groupActions.searchForGroups.type,
            payload: searchGroupsParam
        })
    });

    it('Should get groups and set related data if the response is success', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                count: 100,
                page: 1,
                size: 10
            }
        };

        const putSetIsLoadingTrueDescriptor = getGroupsIterator.next().value;
        expect(putSetIsLoadingTrueDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(true)),
        );

        const callGetGroupDescriptor = getGroupsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getMyGroups, getGroupsParam.page, getGroupsParam.size),
        );

        const putSetIsLoadingFalseDescriptor = getGroupsIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(false)),
        );

        let getGroupsSuccessPutDescriptor = getGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setGroups(response.data.rows)),
        );

        getGroupsSuccessPutDescriptor = getGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setCurrentGroupPage(response.data.page)),
        );

        getGroupsSuccessPutDescriptor = getGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setGroupTotalPage(response.data.count)),
        );

        getGroupsSuccessPutDescriptor = getGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setGroupPageSize(getGroupsParam.size)),
        );

        const iteration = getGroupsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get groups but not set data because server error', () => {
        const response = {
            success: false,
        };

        const putSetIsLoadingTrueDescriptor = getGroupsIterator.next().value;
        expect(putSetIsLoadingTrueDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(true)),
        );

        const callGetGroupDescriptor = getGroupsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getMyGroups, getGroupsParam.page, getGroupsParam.size),
        );

        const putSetIsLoadingFalseDescriptor = getGroupsIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(false)),
        );

        const iteration = getGroupsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get invitations and set related data if the response is success', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                count: 100,
                page: 1,
                size: 10
            }
        };

        const putSetIsLoadingTrueDescriptor = getInvitationsIterator.next().value;
        expect(putSetIsLoadingTrueDescriptor).toEqual(
            put(slice.groupActions.setIsModalLoading(true)),
        );

        const callGetInvitationsDescriptor = getInvitationsIterator.next().value;
        expect(callGetInvitationsDescriptor).toEqual(
            call(getGroupInvitations, getInvitationsParam.page, getInvitationsParam.size, getInvitationsParam.invitationType),
        );

        const putSetIsLoadingFalseDescriptor = getInvitationsIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupActions.setIsModalLoading(false)),
        );

        let getGroupsSuccessPutDescriptor = getInvitationsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setInvitations(response.data.rows)),
        );

        getGroupsSuccessPutDescriptor = getInvitationsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setCurrentInvitationPage(response.data.page)),
        );

        getGroupsSuccessPutDescriptor = getInvitationsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setInvitationTotalPage(response.data.count)),
        );

        getGroupsSuccessPutDescriptor = getInvitationsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setGroupInvitationPageSize(getGroupsParam.size)),
        );

        const iteration = getInvitationsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get invitations but not set any data because the response is error', () => {
        const response = {
            success: false,
        };

        const putSetIsLoadingTrueDescriptor = getInvitationsIterator.next().value;
        expect(putSetIsLoadingTrueDescriptor).toEqual(
            put(slice.groupActions.setIsModalLoading(true)),
        );

        const callGetGroupDescriptor = getInvitationsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getGroupInvitations, getInvitationsParam.page, getInvitationsParam.size, getInvitationsParam.invitationType),
        );

        const putSetIsLoadingFalseDescriptor = getInvitationsIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupActions.setIsModalLoading(false)),
        );

        const iteration = getInvitationsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should search for groups and set related data if the response is success', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                count: 100,
                page: 1,
                size: 10
            }
        };

        let putDescriptor = searchForGroupsIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setPerformedSearch(true)),
        );

        putDescriptor = searchForGroupsIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(true)),
        );

        const callSearchGroupDescriptor = searchForGroupsIterator.next().value;
        expect(callSearchGroupDescriptor).toEqual(
            call(searchGroups, searchGroupsParam.keyword, searchGroupsParam.page, searchGroupsParam.size),
        );

        putDescriptor = searchForGroupsIterator.next(response).value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(false)),
        );

        putDescriptor = searchForGroupsIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setSearchKeyword(searchGroupsParam.keyword)),
        );

        let getGroupsSuccessPutDescriptor = searchForGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setSearchResults(response.data.rows)),
        );

        getGroupsSuccessPutDescriptor = searchForGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setSearchCurrentPage(response.data.page)),
        );

        getGroupsSuccessPutDescriptor = searchForGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setSearchTotalPage(response.data.count)),
        );

        getGroupsSuccessPutDescriptor = searchForGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setGroupSearchPageSize(searchGroupsParam.size)),
        );

        const iteration = searchForGroupsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should search for groups but not setting anything because server response error.', () => {
        const response = {
            success: false
        };

        let putDescriptor = searchForGroupsIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setPerformedSearch(true)),
        );

        putDescriptor = searchForGroupsIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(true)),
        );

        const callSearchGroupDescriptor = searchForGroupsIterator.next().value;
        expect(callSearchGroupDescriptor).toEqual(
            call(searchGroups, searchGroupsParam.keyword, searchGroupsParam.page, searchGroupsParam.size),
        );

        putDescriptor = searchForGroupsIterator.next(response).value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setIsLoading(false)),
        );

        putDescriptor = searchForGroupsIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.groupActions.setSearchKeyword(searchGroupsParam.keyword)),
        );

        const iteration = searchForGroupsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get the groups user requested to join and set related data if the response is success', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                count: 100,
                page: 1,
                size: 10
            }
        };

        const putSetIsLoadingTrueDescriptor = getRequestedGroupsIterator.next().value;
        expect(putSetIsLoadingTrueDescriptor).toEqual(
            put(slice.groupActions.setisGettingRequestedGroups(true)),
        );

        const callGetGroupDescriptor = getRequestedGroupsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getGroupInvitations, getRequestedGroupsParam.page, getRequestedGroupsParam.size, getRequestedGroupsParam.invitationType),
        );

        const putSetIsLoadingFalseDescriptor = getRequestedGroupsIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupActions.setisGettingRequestedGroups(false)),
        );

        let getGroupsSuccessPutDescriptor = getRequestedGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setRequestedGroups(response.data.rows)),
        );

        getGroupsSuccessPutDescriptor = getRequestedGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setRequestedGroupCurrentPage(response.data.page)),
        );

        getGroupsSuccessPutDescriptor = getRequestedGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setRequestedGroupTotalPage(response.data.count)),
        );

        getGroupsSuccessPutDescriptor = getRequestedGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setRequestedGroupPageSize(getGroupsParam.size)),
        );

        const iteration = getRequestedGroupsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get the groups user requested to join and set empty array if the response is error', () => {
        const response = {
            success: false,
        };

        const putSetIsLoadingTrueDescriptor = getRequestedGroupsIterator.next().value;
        expect(putSetIsLoadingTrueDescriptor).toEqual(
            put(slice.groupActions.setisGettingRequestedGroups(true)),
        );

        const callGetGroupDescriptor = getRequestedGroupsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getGroupInvitations, getRequestedGroupsParam.page, getRequestedGroupsParam.size, getRequestedGroupsParam.invitationType),
        );

        const putSetIsLoadingFalseDescriptor = getRequestedGroupsIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupActions.setisGettingRequestedGroups(false)),
        );

        let getGroupsSuccessPutDescriptor = getRequestedGroupsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupActions.setRequestedGroups([])),
        );

        const iteration = getRequestedGroupsIterator.next();
        expect(iteration.done).toBe(true);
    });
});

describe('my groups saga init', () => {
    const groupsListIterator = groupsListSaga();
    it('should start task to watch for getGroups action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupActions.getGroups.type, getGroups),
        );
    });

    it('should start task to watch for getInvitations action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupActions.getGroupInvitations.type, getInvitations),
        );
    });

    it('should start task to watch for getGroupInvitations action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupActions.searchForGroups.type, searchForGroups),
        );
    });

    it('should start task to watch for getRequestedGroups action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupActions.getRequestedGroups.type, getRequestedGroups),
        );
    });
});