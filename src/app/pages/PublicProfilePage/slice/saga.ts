/**
 * Root saga manages watcher lifecycle
 */

import { publicProfileActions } from ".";
import { put, takeLatest, call } from 'redux-saga/effects';
import { getFollowers, getFollowings, getProfileById } from "services/live-data-server/profile";
import { showToastMessageOnRequestError } from "utils/helpers";

function* getProfile({ type, payload }) {
    const profileId = payload;
    yield put(publicProfileActions.setGetProfileFailed(false));
    yield put(publicProfileActions.setIsLoadingProfile(true));
    const response = yield call(getProfileById, profileId);
    yield put(publicProfileActions.setIsLoadingProfile(false));

    if (response.success) {
        yield put(publicProfileActions.setProfile(response.data));
    } else {
        showToastMessageOnRequestError(response.error);
        yield put(publicProfileActions.setGetProfileFailed(true));
    }
}

function* getProfileFollowers({ type, payload }) {
    const { profileId, page, size } = payload;
    yield put(publicProfileActions.setModalLoading(true));
    const response = yield call(getFollowers, profileId, page, size);
    yield put(publicProfileActions.setModalLoading(false));

    if (response.success) {
        yield put(publicProfileActions.setCurrentFollowerPage(page));
        yield put(publicProfileActions.setTotalFollowerRecords(response.data.count));
        yield put(publicProfileActions.setFollowers(response.data.rows));
        yield put(publicProfileActions.setFollowerTotalPage(response.data.count < 10 ? 1 : Math.ceil(response.data.count / 10)));
        yield put(publicProfileActions.setFollowerPageSize(response.data.size));
    } else {
        yield put(publicProfileActions.setFollowers([]));
    }
}

function* getProfileFollowing({ type, payload }) {
    const { profileId, page, size } = payload;
    yield put(publicProfileActions.setModalLoading(true));
    const response = yield call(getFollowings, profileId, page, size);
    yield put(publicProfileActions.setModalLoading(false));

    if (response.success) {
        yield put(publicProfileActions.setCurrentFollowingPage(page));
        yield put(publicProfileActions.setTotalFollowingRecords(response.data.count));
        yield put(publicProfileActions.setFollowing(response.data.rows));
        yield put(publicProfileActions.setFollowingTotalPage(response.data.count < 10 ? 1 : Math.ceil(response.data.count / 10)));
        yield put(publicProfileActions.setFollowingPageSize(response.data.size));
    } else {
        yield put(publicProfileActions.setFollowing([]));
    }
}

export default function* privacyPolicySaga() {
    yield takeLatest(publicProfileActions.getProfile.type, getProfile);
    yield takeLatest(publicProfileActions.getFollowers.type, getProfileFollowers);
    yield takeLatest(publicProfileActions.getFollowing.type, getProfileFollowing);
}
