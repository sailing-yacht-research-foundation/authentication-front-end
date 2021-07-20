/**
 * Root saga manages watcher lifecycle
 */

import { facebookActions } from ".";
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { Auth } from "aws-amplify";
import { toast } from 'react-toastify';
import { loginActions } from "app/pages/LoginPage/slice";
import { getFeeds, exchangeToken } from "services/facebook";

export function* getFacebookFeeds() {
    const user = yield select(selectUser);
    const response = yield call(getFeeds, user);

    if (response.data && response.data.data)
        yield put(facebookActions.setPosts(response.data.data));
    else  yield put(facebookActions.setGetFeedsErrorState(true));
}

export function* exchangeFacebookToken(token) {
    const response = yield call(exchangeToken, token);

    if (response.response) // error, change state to error 
        yield put(facebookActions.setExchangeTokenErrorState(true));

    if (response.data?.access_token) {
        const result = yield call(updateUserFacebookToken, response.data?.access_token);

        if (result.success) {
            yield put(facebookActions.setIsConnected(true));
            yield put(loginActions.getUser());
            toast.success(result.message);
        } else toast.error(result.message);
    }
}

export function updateUserFacebookToken(token) {
    return Auth.currentAuthenticatedUser().then(user => {
        return Auth.updateUserAttributes(user, {
            'custom:fb_token': token
        }).then(() => {
            return {
                success: true,
                message: 'Successfully linked your Facebook account!'
            }
        }).catch(error => {
            return {
                success: false,
                message: error.message
            }
        })
    }).catch(error => {
        return {
            success: false,
            message: error.message
        }
    })
}

export function* facebookSaga() {
    yield takeLatest(facebookActions.getPosts.type, getFacebookFeeds);
    yield takeLatest(facebookActions.exchangeToken.type, exchangeFacebookToken);
}
