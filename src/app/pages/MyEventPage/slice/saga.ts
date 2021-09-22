/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getMany } from "services/live-data-server/event-calendars";
import { myEventListActions } from ".";

export function* getEvents(action) {
    yield put(myEventListActions.setIsChangingPage(true));

    const response = yield call(getMany, action.payload);

    yield put(myEventListActions.setIsChangingPage(false));
    yield put(myEventListActions.setPage(action.payload));

    if (response.success) {
        if (response.data?.count > 0) {
            yield put(myEventListActions.setResults(response.data?.rows));
            yield put(myEventListActions.setTotal(response.data?.count));
        } else {
            yield put(myEventListActions.setResults([]));
            yield put(myEventListActions.setTotal(0));
        }
    }
}

export default function* myEventListSaga() {
    yield takeLatest(myEventListActions.getEvents.type, getEvents);
}
