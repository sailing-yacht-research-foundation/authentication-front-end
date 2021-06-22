/**
 * Root saga manages watcher lifecycle
 */

import Auth from "@aws-amplify/auth";
import { loginActions } from ".";
import { all, call, put, takeLatest } from 'redux-saga/effects';

function* getAuthUser() {
    const user =  yield call(getAuthorizedUser);
    if (user) yield put(loginActions.setUser(JSON.parse(JSON.stringify(user))));

}

async function getAuthorizedUser() {
   return await Auth.currentAuthenticatedUser();
}

export default function* loginSaga() {
    yield takeLatest(loginActions.getUser.type, getAuthUser);
}
