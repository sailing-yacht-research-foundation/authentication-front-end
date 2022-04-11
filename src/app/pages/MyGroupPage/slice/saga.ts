/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getGroupInvitations, getMyGroups, searchGroups } from "services/live-data-server/groups";
import { GroupMemberStatus } from "utils/constants";
import { showToastMessageOnRequestError } from "utils/helpers";
import { groupActions } from ".";

export function* getGroups({ type, payload }) {
    const { page, size } = payload;

    yield put(groupActions.setIsLoading(true));
    const response = yield call(getMyGroups, page, size);
    yield put(groupActions.setIsLoading(false));

    if (response.success) {
        yield put(groupActions.setGroups(response.data?.rows));
        yield put(groupActions.setCurrentGroupPage(response.data.page));
        yield put(groupActions.setGroupTotalPage(response.data.count));
        yield put(groupActions.setGroupPageSize(response.data.size));
    }
}

export function* searchForGroups({type, payload }) {
    const { keyword, page, size } = payload;

    yield put(groupActions.setPerformedSearch(true));
    yield put(groupActions.setIsLoading(true));
    const response = yield call(searchGroups, keyword, page, size);
    yield put(groupActions.setIsLoading(false));
    yield put(groupActions.setSearchKeyword(keyword));

    if (response.success) {
        yield put(groupActions.setSearchResults(response.data.rows));
        yield put(groupActions.setSearchCurrentPage(response.data.page));
        yield put(groupActions.setSearchTotalPage(response.data.count));
        yield put(groupActions.setGroupSearchPageSize(response.data.size));
    } else {
        showToastMessageOnRequestError(response.error);
    }
}

export function* getInvitations({ type, payload }) {
    const { page, invitationType, size } = payload;

    yield put(groupActions.setIsModalLoading(true));
    const response = yield call(getGroupInvitations, page, size, invitationType);
    yield put(groupActions.setIsModalLoading(false));

    if (response.success) {
        yield put(groupActions.setInvitations(response.data.rows));
        yield put(groupActions.setCurrentInvitationPage(response.data.page));
        yield put(groupActions.setInvitationTotalPage(response.data.count));
        yield put(groupActions.setGroupInvitationPageSize(response.data.size));
    }
}

export function* getRequestedGroups({ type, payload }) {
    const { page, size } = payload;

    yield put(groupActions.setisGettingRequestedGroups(true));
    const response = yield call(getGroupInvitations,page, size, GroupMemberStatus.REQUESTED);
    yield put(groupActions.setisGettingRequestedGroups(false));

    if (response.success) {
        yield put(groupActions.setRequestedGroups(response.data.rows));
        yield put(groupActions.setRequestedGroupCurrentPage(page));
        yield put(groupActions.setRequestedGroupTotalPage(response.data.count));
        yield put(groupActions.setRequestedGroupPageSize(response.data.size));
    } else {
        yield put(groupActions.setRequestedGroups([]));
    }
}

export default function* groupSaga() {
    yield takeLatest(groupActions.getGroups.type, getGroups);
    yield takeLatest(groupActions.getGroupInvitations.type, getInvitations);
    yield takeLatest(groupActions.searchForGroups.type, searchForGroups);
    yield takeLatest(groupActions.getRequestedGroups.type, getRequestedGroups);
}
