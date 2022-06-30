import { put, takeLatest, call } from 'redux-saga/effects';
import { getAdmins, getGroupById, getMembers, searchMembers } from 'services/live-data-server/groups';
import * as slice from '..';
import { v4 as uuidv4 } from 'uuid';

import groupDetailSaga, { getGroup, getGroupAdmins, getGroupMembers, searchAcceptedMembers } from '../saga';
import { GroupMemberStatus } from 'utils/constants';
import * as Helpers from 'utils/helpers';

describe('groups detail Saga', () => {
    let getGroupIterator: ReturnType<typeof getGroup>;
    let getGroupAdminsIterator: ReturnType<typeof getGroupAdmins>;
    let getGroupMembersIterator: ReturnType<typeof getGroupMembers>;
    let searchAcceptedMembersIterator: ReturnType<typeof searchAcceptedMembers>;
    const getGroupParam = uuidv4();
    const getAdminsParam = { page: 5, groupId: uuidv4(), size: 20 };
    const getMembersParam = { page: 5, groupId: uuidv4(), status: GroupMemberStatus.ACCEPTED, size: 20 };
    const searchAcceptedMembersParam = { groupId: uuidv4(), status: GroupMemberStatus.ACCEPTED, keyword: 'Dat dang' };

    it('Should get group and set related data if the response is success', () => {
        const response = {
            success: true,
            data: {
            }
        };

        getGroupIterator = getGroup({
            type: slice.groupDetailActions.getGroup.type,
            payload: getGroupParam
        });

        const putSetIsGettingGroupFailedDescriptor = getGroupIterator.next().value;
        expect(putSetIsGettingGroupFailedDescriptor).toEqual(
            put(slice.groupDetailActions.setIsGetGroupFailed(false)),
        );

        const putSetIsGettingGroup = getGroupIterator.next().value;
        expect(putSetIsGettingGroup).toEqual(
            put(slice.groupDetailActions.setIsGettingGroup(true)),
        );

        const callGetGroupDescriptor = getGroupIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getGroupById, getGroupParam),
        );

        const putSetIsLoadingFalseDescriptor = getGroupIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupDetailActions.setIsGettingGroup(false)),
        );

        let getGroupsSuccessPutDescriptor = getGroupIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setGroup(response.data)),
        );

        const showToastMessageOnRequestErrorSpy = jest.spyOn(Helpers, 'showToastMessageOnRequestError');
        expect(showToastMessageOnRequestErrorSpy).not.toBeCalled();

        const iteration = getGroupIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get group and set getting group failed if the response is error', () => {
        const response = {
            success: false,
            error: {
                response: {
                    status: 500
                }
            }
        };
        
        const showToastMessageOnRequestErrorSpy = jest.spyOn(Helpers, 'showToastMessageOnRequestError');

        getGroupIterator = getGroup({
            type: slice.groupDetailActions.getGroup.type,
            payload: getGroupParam
        });

        let putSetIsGettingGroupFailedDescriptor = getGroupIterator.next().value;
        expect(putSetIsGettingGroupFailedDescriptor).toEqual(
            put(slice.groupDetailActions.setIsGetGroupFailed(false)),
        );

        const putSetIsGettingGroup = getGroupIterator.next().value;
        expect(putSetIsGettingGroup).toEqual(
            put(slice.groupDetailActions.setIsGettingGroup(true)),
        );

        const callGetGroupDescriptor = getGroupIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getGroupById, getGroupParam),
        );

        const putSetIsLoadingFalseDescriptor = getGroupIterator.next(response).value;
        expect(putSetIsLoadingFalseDescriptor).toEqual(
            put(slice.groupDetailActions.setIsGettingGroup(false)),
        );

        putSetIsGettingGroupFailedDescriptor = getGroupIterator.next(response).value;
        expect(putSetIsGettingGroupFailedDescriptor).toEqual(
            put(slice.groupDetailActions.setIsGetGroupFailed(true)),
        );

        const iteration = getGroupIterator.next();
        expect(iteration.done).toBe(true);

        expect(showToastMessageOnRequestErrorSpy).toHaveBeenCalledWith(response.error);
    });

    it('Should get groups admins', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                page: 1,
                count: 100,
                size: 10
            }
        };

        getGroupAdminsIterator = getGroupAdmins({
            type: slice.groupDetailActions.getAdmins.type,
            payload: getAdminsParam
        });

        const putSetIsGettingAdmins = getGroupAdminsIterator.next().value;
        expect(putSetIsGettingAdmins).toEqual(
            put(slice.groupDetailActions.setIsGettingAdmins(true)),
        );

        const callGetGroupDescriptor = getGroupAdminsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getAdmins, getAdminsParam.groupId, getAdminsParam.page, getAdminsParam.size),
        );

        const putSetIsGettingAdminsFalse = getGroupAdminsIterator.next(response).value;
        expect(putSetIsGettingAdminsFalse).toEqual(
            put(slice.groupDetailActions.setIsGettingAdmins(false)),
        );

        let getGroupsSuccessPutDescriptor = getGroupAdminsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setAdmins(response.data.rows)),
        );

        getGroupsSuccessPutDescriptor = getGroupAdminsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setCurrentAdminPage(response.data.page)),
        );

        getGroupsSuccessPutDescriptor = getGroupAdminsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setAdminTotal(response.data.count)),
        );

        getGroupsSuccessPutDescriptor = getGroupAdminsIterator.next().value;
        expect(getGroupsSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setAdminPageSize(response.data.size)),
        );

        const iteration = getGroupAdminsIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get groups admins and not set anything because the server error', () => {
        const response = {
            success: false,
        };

        getGroupAdminsIterator = getGroupAdmins({
            type: slice.groupDetailActions.getAdmins.type,
            payload: getAdminsParam
        });

        const putSetIsGettingAdmins = getGroupAdminsIterator.next().value;
        expect(putSetIsGettingAdmins).toEqual(
            put(slice.groupDetailActions.setIsGettingAdmins(true)),
        );

        const callGetGroupDescriptor = getGroupAdminsIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getAdmins, getAdminsParam.groupId, getAdminsParam.page, getAdminsParam.size),
        );

        const putSetIsGettingAdminsFalse = getGroupAdminsIterator.next(response).value;
        expect(putSetIsGettingAdminsFalse).toEqual(
            put(slice.groupDetailActions.setIsGettingAdmins(false)),
        );

        const iteration = getGroupAdminsIterator.next();
        expect(iteration.done).toBe(true);
    });


    it('Should get groups members', () => {
        const response = {
            success: true,
            data: {
                rows: [],
                page: 1,
                count: 100,
                size: 10
            }
        };

        getGroupMembersIterator = getGroupMembers({
            type: slice.groupDetailActions.getMembers.type,
            payload: getMembersParam
        });

        let putSetIsGettingGroupMembers = getGroupMembersIterator.next().value;
        expect(putSetIsGettingGroupMembers).toEqual(
            put(slice.groupDetailActions.setIsGettingMembers(true)),
        );

        const callGetGroupDescriptor = getGroupMembersIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getMembers, getMembersParam.groupId, getMembersParam.page, getMembersParam.size, getMembersParam.status),
        );

        putSetIsGettingGroupMembers = getGroupMembersIterator.next(response).value;
        expect(putSetIsGettingGroupMembers).toEqual(
            put(slice.groupDetailActions.setIsGettingMembers(false)),
        );

        let getGroupsMembersSuccessPutDescriptor = getGroupMembersIterator.next().value;
        expect(getGroupsMembersSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setMembers(response.data.rows)),
        );

        getGroupsMembersSuccessPutDescriptor = getGroupMembersIterator.next().value;
        expect(getGroupsMembersSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setCurrentMemberPage(response.data.page)),
        );

        getGroupsMembersSuccessPutDescriptor = getGroupMembersIterator.next().value;
        expect(getGroupsMembersSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setMemberTotal(response.data.count)),
        );

        getGroupsMembersSuccessPutDescriptor = getGroupMembersIterator.next().value;
        expect(getGroupsMembersSuccessPutDescriptor).toEqual(
            put(slice.groupDetailActions.setMemberPageSize(response.data.size)),
        );

        const iteration = getGroupMembersIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get groups members but does nothing because server error', () => {
        const response = {
            success: false
        };

        getGroupMembersIterator = getGroupMembers({
            type: slice.groupDetailActions.getMembers.type,
            payload: getMembersParam
        });

        let putSetIsGettingGroupMembers = getGroupMembersIterator.next().value;
        expect(putSetIsGettingGroupMembers).toEqual(
            put(slice.groupDetailActions.setIsGettingMembers(true)),
        );

        const callGetGroupDescriptor = getGroupMembersIterator.next().value;
        expect(callGetGroupDescriptor).toEqual(
            call(getMembers, getMembersParam.groupId, getMembersParam.page, getMembersParam.size, getMembersParam.status),
        );

        putSetIsGettingGroupMembers = getGroupMembersIterator.next(response).value;
        expect(putSetIsGettingGroupMembers).toEqual(
            put(slice.groupDetailActions.setIsGettingMembers(false)),
        );

        const iteration = getGroupMembersIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('should handle searchAcceptedMembers', () => {
        const response = {
            success: true,
            data: {
                rows: []
            }
        }

        searchAcceptedMembersIterator = searchAcceptedMembers({
            type: slice.groupDetailActions.searchAcceptedMembers.type,
            payload: searchAcceptedMembersParam
        })

        let searchAcceptedMembersDescriptor = searchAcceptedMembersIterator.next().value;
        expect(searchAcceptedMembersDescriptor).toEqual(
            call(searchMembers, searchAcceptedMembersParam.groupId, searchAcceptedMembersParam.keyword, searchAcceptedMembersParam.status),
        );

        searchAcceptedMembersDescriptor = searchAcceptedMembersIterator.next(response).value;
        expect(searchAcceptedMembersDescriptor).toEqual(
            put(slice.groupDetailActions.setAcceptedMemberResults(response.data.rows)),
        );

        const iteration = searchAcceptedMembersIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('should handle searchAcceptedMembers but doesnt set data as the server is error', () => {
        const response = {
            success: false,

        }

        searchAcceptedMembersIterator = searchAcceptedMembers({
            type: slice.groupDetailActions.searchAcceptedMembers.type,
            payload: searchAcceptedMembersParam
        })

        let searchAcceptedMembersDescriptor = searchAcceptedMembersIterator.next().value;
        expect(searchAcceptedMembersDescriptor).toEqual(
            call(searchMembers, searchAcceptedMembersParam.groupId, searchAcceptedMembersParam.keyword, searchAcceptedMembersParam.status),
        );

        const iteration = searchAcceptedMembersIterator.next(response);
        expect(iteration.done).toBe(true);
    });
});

describe('group detail saga init', () => {
    const groupsListIterator = groupDetailSaga();

    it('should start task to watch for getAdmins action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupDetailActions.getAdmins.type, getGroupAdmins),
        );
    });

    it('should start task to watch for getMembers action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupDetailActions.getMembers.type, getGroupMembers),
        );
    });

    it('should start task to watch for getGroup action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupDetailActions.getGroup.type, getGroup),
        );
    });

    it('should start task to watch for searchAcceptedMembers action', () => {
        const takeLatestDescriptor = groupsListIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.groupDetailActions.searchAcceptedMembers.type, searchAcceptedMembers),
        );
    });
});