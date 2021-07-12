/**
 * Root saga manages watcher lifecycle
 */

import { facebookActions } from ".";
import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from "axios";
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { getUserAttribute } from "utils/user-utils";
import { Auth } from "aws-amplify";
import { toast } from 'react-toastify';
import { loginActions } from "app/pages/LoginPage/slice";

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

function getFeeds(user) {
    return axios.get('https://graph.facebook.com/me/feed?fields=attachments', {
        params: {
            access_token: getUserAttribute(user, 'custom:fb_token')
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}

function exchangeToken(payload) {
    return axios.post('http://localhost:3003/facebook/token/exchange', {
        token: payload.payload
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function* facebookSaga() {
    yield takeLatest(facebookActions.getPosts.type, getFacebookFeeds);
    yield takeLatest(facebookActions.exchangeToken.type, exchangeFacebookToken);
}
