/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getGroupInvitations, getMyGroups, searchGroups } from "services/live-data-server/groups";
import { groupActions } from ".";

export function* getGroups({ type, payload }) {
    const page = payload;

    yield put(groupActions.setIsLoading(true));
    const response = yield call(getMyGroups, page);
    yield put(groupActions.setIsLoading(false));

    if (response.success) {
        yield put(groupActions.setGroups(response.data?.rows));
        yield put(groupActions.setCurrentGroupPage(response.data?.page));
        yield put(groupActions.setGroupTotalPage(response.data?.count));
    }
}

export function* searchForGroups({type, payload }) {
    const { keyword, page } = payload;

    yield put(groupActions.setIsLoading(true));
    const response = yield call(searchGroups, keyword, page);
    yield put(groupActions.setIsLoading(false));
    yield put(groupActions.setSearchKeyword(keyword));

    if (response.success) {
        yield put(groupActions.setSearchResults(response.data?.rows));
        yield put(groupActions.setSearchCurrentPage(response.data?.page));
        yield put(groupActions.setSearchTotalPage(response.data?.count));
    }
}

export function* getInvitations({ type, payload }) {
    const { page, invitationType } = payload;

    yield put(groupActions.setIsLoading(true));
    const response = yield call(getGroupInvitations, page, invitationType);
    yield put(groupActions.setIsLoading(false));

    if (response.success) {
        yield put(groupActions.setInvitations(response.data?.rows));
        yield put(groupActions.setCurrentInvitationPage(response.data?.page));
        yield put(groupActions.setInvitationTotalPage(response.data?.count));
    }
}

export default function* groupSaga() {
    yield takeLatest(groupActions.getGroups.type, getGroups);
    yield takeLatest(groupActions.getGroupInvitations.type, getInvitations);
    yield takeLatest(groupActions.searchForGroups.type, searchForGroups);
}
