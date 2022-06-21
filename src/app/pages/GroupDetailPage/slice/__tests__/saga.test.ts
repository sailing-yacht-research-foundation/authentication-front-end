import { put, takeLatest, call } from 'redux-saga/effects';
import { getGroupById } from 'services/live-data-server/groups';
import * as slice from '..';
import { v4 as uuidv4 } from 'uuid';

import groupDetailSaga, { getGroup, getGroupAdmins, getGroupMembers, searchAcceptedMembers } from '../saga';
import { GroupMemberStatus } from 'utils/constants';

describe('groups list Saga', () => {
    let getGroupIterator: ReturnType<typeof getGroup>;
    let getGroupAdminsIterator: ReturnType<typeof getGroupAdmins>;
    let getGroupMembersIterator: ReturnType<typeof getGroupMembers>;
    let searchAcceptedMembersIterator: ReturnType<typeof searchAcceptedMembers>;
    const getGroupParam = uuidv4();
    const getAdminsParam = { page: 5, groupId: uuidv4(), status: GroupMemberStatus.ACCEPTED, size: 20 };
    const getMembersParam = { page: 5, groupId: uuidv4(), status: GroupMemberStatus.ACCEPTED, size: 20 };
    const searchAcceptedMembersParam = { page: 5, groupId: uuidv4(), status: GroupMemberStatus.ACCEPTED, size: 20 };

    // We have to test twice, once for a successful load and once for an unsuccessful one
    // so we do all the stuff that happens beforehand automatically in the beforeEach
    beforeEach(() => {
        getGroupIterator = getGroup({
            type: slice.groupDetailActions.getGroup.type,
            payload: getGroupParam
        });
        getGroupAdminsIterator = getGroupAdmins({
            type: slice.groupDetailActions.getAdmins.type,
            payload: getAdminsParam
        });
        getGroupMembersIterator = getGroupMembers({
            type: slice.groupDetailActions.getMembers.type,
            payload: getMembersParam
        });
        searchAcceptedMembersIterator = searchAcceptedMembers({
            type: slice.groupDetailActions.searchAcceptedMembers.type,
            payload: searchAcceptedMembersParam
        })
    });

    it('Should get group and set related data if the response is success', () => {
        const response = {
            success: true,
            data: {
            }
        };

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

        const iteration = getGroupIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('Should get group and set getting group failed if the response is error', () => {
        const response = {
            success: false
        };

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