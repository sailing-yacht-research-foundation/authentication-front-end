/**
 * Root saga manages watcher lifecycle
 */

import { eulaActions } from ".";
import { call, takeLatest, select, put } from 'redux-saga/effects';
import { getUser, updateAgreements } from "services/live-data-server/user";
import { selectIsAuthenticated } from "app/pages/LoginPage/slice/selectors";
import { loginActions } from "app/pages/LoginPage/slice";

export function* signEulaVersion({type, payload}) {
    const isAuthenticated = yield select(selectIsAuthenticated);

    if (!isAuthenticated) return;

    const response = yield call(getAuthorizedUser);
    
    if (response.user) {
        yield call(updateAgreements, { eulaVersion: payload });
        yield put(loginActions.getUser());
    };
}

function getAuthorizedUser() {
    return getUser();
}

export default function* loginSaga() {
    yield takeLatest(eulaActions.signEulaVersion.type, signEulaVersion);
}
