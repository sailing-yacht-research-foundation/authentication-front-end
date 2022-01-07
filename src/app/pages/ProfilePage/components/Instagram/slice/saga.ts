/**
 * Root saga manages watcher lifecycle
 */

import { instagramActions } from ".";
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { getFeeds, exchangeTokenFromCode } from "services/instagram";

export function* getInstagramFeeds() {
    const user = yield select(selectUser);
    const response = yield call(getFeeds, user);

    if (response.data && response.data.data)
        yield put(instagramActions.setPosts(response.data.data));
    else yield put(instagramActions.setGetFeedsErrorState(true));
}

export function* exchangeInstagramTokenFromCode(code) {
    const response = yield call(exchangeTokenFromCode, code);

    if (response.response) // error, change state to error 
        yield put(instagramActions.setExchangeTokenErrorState(true));

    if (response.data?.access_token) {
        yield put(instagramActions.exchangeLongLivedToken(response.data.access_token));
    }
}

export function* instagramSaga() {
    yield takeLatest(instagramActions.getPosts.type, getInstagramFeeds);
    yield takeLatest(instagramActions.exchangeTokenFromCode.type, exchangeInstagramTokenFromCode);
}
