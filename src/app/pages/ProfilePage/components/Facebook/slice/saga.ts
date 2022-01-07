/**
 * Root saga manages watcher lifecycle
 */

import { facebookActions } from ".";
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { getFeeds } from "services/facebook";

export function* getFacebookFeeds() {
    const user = yield select(selectUser);
    const response = yield call(getFeeds, user);

    if (response.data && response.data.data)
        yield put(facebookActions.setPosts(response.data.data));
    else  yield put(facebookActions.setGetFeedsErrorState(true));
}


export function* facebookSaga() {
    yield takeLatest(facebookActions.getPosts.type, getFacebookFeeds);
}
