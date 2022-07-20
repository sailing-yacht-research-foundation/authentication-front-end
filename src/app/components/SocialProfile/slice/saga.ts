/**
 * Root saga manages watcher lifecycle
 */

 import { socialActions } from ".";
 import { call, put, takeLatest } from 'redux-saga/effects';
import { getRequestedFollowRequests } from "services/live-data-server/profile";

 export function* getFollowRequests(action) {
    const  { page, size } = action.payload;
     const response = yield call(getRequestedFollowRequests, page, size);

     if (response.success) {
         yield put(socialActions.setPagination({
            rows: response.data.rows,
            page: page,
            total: response.data.count,
            size: response.data.size
         }));
     }
 }


 export default function* loginSaga() {
     yield takeLatest(socialActions.getFollowRequests.type, getFollowRequests);
 }
