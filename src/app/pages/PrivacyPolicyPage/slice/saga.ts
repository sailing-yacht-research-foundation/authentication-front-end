/**
 * Root saga manages watcher lifecycle
 */

import { privacyPolicyActions } from ".";
import { call, takeLatest, select, put } from 'redux-saga/effects';
import { getUser, updateAgreements } from "services/live-data-server/user";
import { selectIsAuthenticated } from "app/pages/LoginPage/slice/selectors";
import { loginActions } from "app/pages/LoginPage/slice";

export function* signPrivacyPolicyVersion({ type, payload }) {
    const isAuthenticated = yield select(selectIsAuthenticated);

    if (!isAuthenticated) return;

    const response = yield call(getAuthorizedUser);
    if (response.user) {
        yield call(updateAgreements, { privacyPolicyVersion: payload })
        yield put(loginActions.getUser());
    }
}

async function getAuthorizedUser() {
    return getUser();
}

export default function* privacyPolicySaga() {
    yield takeLatest(privacyPolicyActions.signPolicyVersion.type, signPrivacyPolicyVersion);
}
