/**
 * Root saga manages watcher lifecycle
 */

import Auth from "@aws-amplify/auth";
import { privacyPolicyActions } from ".";
import { call, takeLatest } from 'redux-saga/effects';
import { logVersion } from "services/versioning";
import { getUserAttribute } from "utils/user-utils";

export function* signPrivacyPolicyVersion(version) {
    const user = yield call(getAuthorizedUser);
    if (user) yield call(logVersion, getUserAttribute(user, 'email'), 'privacy', version);
}

async function getAuthorizedUser() {
    return await Auth.currentAuthenticatedUser().then(user => {
        return user;
    }).catch(error => {
        return null;
    });
}

export default function* loginSaga() {
    yield takeLatest(privacyPolicyActions.signPolicyVersion.type, signPrivacyPolicyVersion);
}
