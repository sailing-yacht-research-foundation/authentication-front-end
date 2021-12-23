/**
 * Root saga manages watcher lifecycle
 */

 import { profileSearchActions } from ".";
 import { put, takeLatest, call } from 'redux-saga/effects';
 import { toast } from "react-toastify";
import { searchForProfiles } from "services/live-data-server/profile";
import { showToastMessageOnRequestError } from "utils/helpers";
 
 function* searchProfiles({ type, payload }) {
     const { name, locale } = payload;
     if (!name) {
        yield put(profileSearchActions.setResults([]));
        return;
     }
     yield put(profileSearchActions.setIsSearching(true));
     const response = yield call(searchForProfiles, name, locale);
     yield put(profileSearchActions.setIsSearching(false));
 
     if (response.success) {
         yield put(profileSearchActions.setResults(response?.data?.rows));
     } else {
        showToastMessageOnRequestError(response.error);
     }
 }
 
 export default function* privacyPolicySaga() {
     yield takeLatest(profileSearchActions.searchProfiles.type, searchProfiles);
 }
 