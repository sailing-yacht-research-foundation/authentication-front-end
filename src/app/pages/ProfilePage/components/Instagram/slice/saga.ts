/**
 * Root saga manages watcher lifecycle
 */

import { instagramActions } from ".";
import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from "axios";
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { getUserAttribute } from "utils/user-utils";
import { Auth } from "aws-amplify";
import { toast } from 'react-toastify';
import { loginActions } from "app/pages/LoginPage/slice";

const SERVICE_URL = process.env.REACT_APP_TOKEN_SERVICE_ENDPOINT;

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

export function* exchangeInstagramLongLivedToken(token) {
    const response = yield call(exChangeLongLivedToken, token);

    if (response.response) // error, change state to error 
        yield put(instagramActions.setExchangeTokenErrorState(true));

    if (response.data?.access_token) {
        const result = yield call(updateUserInstagramToken, response.data.access_token);

        if (result.success) {
            yield put(instagramActions.setIsConnected(true));
            yield put(loginActions.getUser());
            toast.success(result.message);
        } else toast.error(result.message);
    }
}

async function getFeeds(user) {
    return axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_url', {
        params: {
            access_token: getUserAttribute(user, 'custom:ig_token')
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}

function exchangeTokenFromCode(action) {
    return axios.post(`${SERVICE_URL}/instagram/token`, {
        code: action.payload
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

function exChangeLongLivedToken(action) {
    return axios.post(`${SERVICE_URL}/instagram/token/exchange`, {
        token: action.payload
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function updateUserInstagramToken(token) {
    return Auth.currentAuthenticatedUser().then(user => {
        return Auth.updateUserAttributes(user, {
            'custom:ig_token': token
        }).then(() => {
            return {
                success: true,
                message: 'Successfully linked your Instagram account!'
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

export function* instagramSaga() {
    yield takeLatest(instagramActions.getPosts.type, getInstagramFeeds);
    yield takeLatest(instagramActions.exchangeTokenFromCode.type, exchangeInstagramTokenFromCode);
    yield takeLatest(instagramActions.exchangeLongLivedToken.type, exchangeInstagramLongLivedToken);
}
