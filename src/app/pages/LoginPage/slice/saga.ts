/**
 * Root saga manages watcher lifecycle
 */

import Auth from "@aws-amplify/auth";
import { loginActions } from ".";
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { anonymousLogin } from "services/live-data-server/auth";
import { selectIsSyrfServiceAuthenticated } from "./selectors";

export function* getAuthUser() {
    const user = yield call(getAuthorizedUser);
    if (user)
        yield put(loginActions.setUser(JSON.parse(JSON.stringify(user))));
    else { // the user is not authenticated, or the user is deleted.
        yield put(loginActions.setLogout());
        localStorage.removeItem('access_token');
        window.location.reload();
    }
}

export function* syrfServiceAnonymousLogin() {

    const isAuthenticated = yield select(selectIsSyrfServiceAuthenticated);

    if (isAuthenticated) return;

    const response = yield call(anonymousLogin);

    if (response.success) {
        localStorage.setItem('session_token', response.token);
        yield put(loginActions.setSYRFServiceAuthorized(true));
    }
}

function getAuthorizedUser() {
    return Auth.currentAuthenticatedUser().then(user => {
        return user;
    }).catch(error => {
        return null;
    });
}

export default function* loginSaga() {
    yield takeLatest(loginActions.getUser.type, getAuthUser);
    yield takeLatest(loginActions.syrfServiceAnonymousLogin.type, syrfServiceAnonymousLogin);
}
