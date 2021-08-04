/**
 * Root saga manages watcher lifecycle
 */

import Auth from "@aws-amplify/auth";
import { loginActions } from ".";
import { call, put, takeLatest } from 'redux-saga/effects';

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

function getAuthorizedUser() {
    return Auth.currentAuthenticatedUser().then(user => {
        return user;
    }).catch(error => {
        return null;
    });
}

export default function* loginSaga() {
    yield takeLatest(loginActions.getUser.type, getAuthUser);
}
