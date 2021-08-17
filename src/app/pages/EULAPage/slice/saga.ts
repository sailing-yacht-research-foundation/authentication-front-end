/**
 * Root saga manages watcher lifecycle
 */

import Auth from "@aws-amplify/auth";
import { eulaActions } from ".";
import { call, takeLatest } from 'redux-saga/effects';
import { logVersion } from "services/versioning";
import { getUserAttribute } from "utils/user-utils";

export function* signEulaVersion(version) {
    const user = yield call(getAuthorizedUser);
    if (user) yield call(logVersion, getUserAttribute(user, 'email'), 'eula', version);
}

function getAuthorizedUser() {
    return Auth.currentAuthenticatedUser().then(user => {
        return user;
    }).catch(error => {
        return null;
    });
}

export default function* loginSaga() {
    yield takeLatest(eulaActions.signEulaVersion.type, signEulaVersion);
}
