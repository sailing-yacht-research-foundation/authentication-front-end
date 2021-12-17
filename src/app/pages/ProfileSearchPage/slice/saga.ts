/**
 * Root saga manages watcher lifecycle
 */

 import { profileSearchActions } from ".";
 import { put, takeLatest, call } from 'redux-saga/effects';
 import { toast } from "react-toastify";
import { searchForProfiles } from "services/live-data-server/profile";
 
 function* searchProfiles({ type, payload }) {
     const { name, locale } = payload;
     if (!name || String(name).length === 0) {
        yield put(profileSearchActions.setResults([]));
        return;
     }
     yield put(profileSearchActions.setIsSearching(true));
     const response = yield call(searchForProfiles, name, locale);
     yield put(profileSearchActions.setIsSearching(false));
 
     if (response.success) {
         yield put(profileSearchActions.setResults(response?.data?.rows));
     } else {
        toast.info('There is a problem searching your results');
     }
 }
 
 export default function* privacyPolicySaga() {
     yield takeLatest(profileSearchActions.searchProfiles.type, searchProfiles);
 }
 