/**
 * Root saga manages watcher lifecycle
 */

import { eulaActions } from ".";
import { call, takeLatest, select } from 'redux-saga/effects';
import { logVersion } from "services/versioning";
import { getUser } from "services/live-data-server/user";
import { selectIsAuthenticated } from "app/pages/LoginPage/slice/selectors";

export function* signEulaVersion(version) {
    const isAuthenticated = yield select(selectIsAuthenticated);

    if (!isAuthenticated) return;

    const response = yield call(getAuthorizedUser);
    
    if (response.user) yield call(logVersion, response.user?.email, 'eula', version);
}

function getAuthorizedUser() {
    return getUser();
}

export default function* loginSaga() {
    yield takeLatest(eulaActions.signEulaVersion.type, signEulaVersion);
}
