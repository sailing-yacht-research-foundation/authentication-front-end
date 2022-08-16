/**
 * Root saga manages watcher lifecycle
 */

 import { call, put, takeLatest } from "@redux-saga/core/effects";
 import { getMany } from 'services/live-data-server/vessels';
 import { vesselListActions } from ".";

 export function* getVessels({ type, payload }) {
     const { page, size, filter, sorter } = payload;

     yield put(vesselListActions.setIsLoading(true));
     const response = yield call(getMany, page, size, filter, sorter);
     yield put(vesselListActions.setIsLoading(false));

     if (response.success) {
         yield put(vesselListActions.setPagination({
             rows: response.data?.rows,
             page: page,
             total: response.data?.count,
             size: response.data?.size
         }));
     }
 }

 export default function* vesselListSaga() {
     yield takeLatest(vesselListActions.getVessels.type, getVessels);
 }
