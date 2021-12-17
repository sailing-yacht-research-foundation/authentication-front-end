/**
 * Root saga manages watcher lifecycle
 */

import { publicProfileActions } from ".";
import { put, takeLatest, call } from 'redux-saga/effects';
import { getFollowers, getFollowings, getProfileById } from "services/live-data-server/profile";
import { toast } from "react-toastify";

function* getProfile({ type, payload }) {
    const profileId = payload;
    yield put(publicProfileActions.setIsLoadingProfile(true));
    const response = yield call(getProfileById, profileId);
    yield put(publicProfileActions.setIsLoadingProfile(false));

    if (response.success) {
        yield put(publicProfileActions.setProfile(response.data));
    } else {
        if (response.error?.response?.status === 404) {
            toast.info('This user profile is not found.');
        } else {
            toast.error('There is an error showing this user profile.');
        }
        yield put(publicProfileActions.setGetProfileFailed(true));
    }
}

function* getProfileFollowers({ type, payload }) {
    const { profileId, page } = payload;
    yield put(publicProfileActions.setModalLoading(true));
    const response = yield call(getFollowers, profileId);
    yield put(publicProfileActions.setModalLoading(false));

    if (response.success) {
        yield put(publicProfileActions.setCurrentFollowerPage(page));
        yield put(publicProfileActions.setTotalFollowerRecords(response.data?.count));
        yield put(publicProfileActions.setFollowers(response.data?.rows));
        yield put(publicProfileActions.setFollowerTotalPage(response.data?.count < 10 ? 1 : Math.ceil(response.data?.count / 10)));
    } else {
        yield put(publicProfileActions.setFollowers([]));
    }
}

function* getProfileFollowing({ type, payload }) {
    const { profileId, page } = payload;
    yield put(publicProfileActions.setModalLoading(true));
    const response = yield call(getFollowings, profileId);
    yield put(publicProfileActions.setModalLoading(false));

    if (response.success) {
        yield put(publicProfileActions.setCurrentFollowingPage(page));
        yield put(publicProfileActions.setTotalFollowingRecords(response.data?.count));
        yield put(publicProfileActions.setFollowing(response.data?.rows));
            yield put(publicProfileActions.setFollowingTotalPage(response.data?.count < 10 ? 1 : Math.ceil(response.data?.count / 10)));
    } else {
        yield put(publicProfileActions.setFollowing([]));
    }
}

export default function* privacyPolicySaga() {
    yield takeLatest(publicProfileActions.getProfile.type, getProfile);
    yield takeLatest(publicProfileActions.getFollowers.type, getProfileFollowers);
    yield takeLatest(publicProfileActions.getFollowing.type, getProfileFollowing);
}
