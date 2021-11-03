/**
 * Root saga manages watcher lifecycle
 */

import { loginActions } from ".";
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { anonymousLogin, renewToken } from "services/live-data-server/auth";
import { selectIsSyrfServiceAuthenticated, selectRefreshToken } from "./selectors";
import { getUser } from "services/live-data-server/user";
import { toast } from "react-toastify";
import { translations } from "locales/translations";
import i18next from "i18next";

export function* getAuthUser() {
    const refreshToken = yield select(selectRefreshToken);
    const response = yield call(getAuthorizedUser);
    
    if (response.success)
        yield put(loginActions.setUser(JSON.parse(JSON.stringify(response.user))));
    else { // the user is not authenticated, or the user is deleted.
        const refreshTokenResponse = yield call(renewToken, refreshToken);
        if (refreshTokenResponse.success) {
            yield put(loginActions.setSessionToken(refreshTokenResponse.data.newtoken));
            yield put(loginActions.setRefreshToken(refreshTokenResponse.data.refresh_token));
            window.location.reload();
            return;
        }
        
        yield put(loginActions.setLogout());
        toast.info(i18next.t(translations.app.your_session_is_expired));
    }
}

export function* syrfServiceAnonymousLogin() {

    const isAuthenticated = yield select(selectIsSyrfServiceAuthenticated);

    if (isAuthenticated) return;

    const response = yield call(anonymousLogin);

    if (response.success) {
        localStorage.setItem('is_guest', '1');
        yield put(loginActions.setSYRFServiceAuthorized(true));
        yield put(loginActions.setSessionToken(response.token));
        yield put(loginActions.setRefreshToken(response.data.refresh_token));
    }
}

export function* getNewToken() {
    const refreshToken = yield select(selectRefreshToken);

    if (!refreshToken) return;

    const response = yield call(renewToken, refreshToken);

    if (response.success) {
        yield put(loginActions.setSessionToken(response.data.newtoken));
        yield put(loginActions.setRefreshToken(response.data.refresh_token));
    } else {
        yield put(loginActions.setLogout());
        toast.info(i18next.t(translations.app.your_session_is_expired));
    }
}

function getAuthorizedUser() {
    return getUser();
}

export default function* loginSaga() {
    yield takeLatest(loginActions.getUser.type, getAuthUser);
    yield takeLatest(loginActions.getNewToken.type, getNewToken);
    yield takeLatest(loginActions.syrfServiceAnonymousLogin.type, syrfServiceAnonymousLogin);
}
