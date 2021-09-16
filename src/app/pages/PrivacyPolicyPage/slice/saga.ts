/**
 * Root saga manages watcher lifecycle
 */

import { privacyPolicyActions } from ".";
import { call, takeLatest, select } from 'redux-saga/effects';
import { logVersion } from "services/versioning";
import { getUser } from "services/live-data-server/user";
import { selectIsAuthenticated } from "app/pages/LoginPage/slice/selectors";

export function* signPrivacyPolicyVersion(version) {
    const isAuthenticated = yield select(selectIsAuthenticated);

    if (!isAuthenticated) return;

    const response = yield call(getAuthorizedUser);
    if (response.user) yield call(logVersion, response.user?.email, 'privacy', version);
}

async function getAuthorizedUser() {
    return getUser();
}

export default function* privacyPolicySaga() {
    yield takeLatest(privacyPolicyActions.signPolicyVersion.type, signPrivacyPolicyVersion);
}
