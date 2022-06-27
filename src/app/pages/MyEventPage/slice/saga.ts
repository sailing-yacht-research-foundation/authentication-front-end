/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getMany } from "services/live-data-server/event-calendars";
import { myEventListActions } from ".";

export function* getEvents(action) {
    yield put(myEventListActions.setIsChangingPage(true));

    const { page, size, filter } = action.payload;
    yield put(myEventListActions.setPage(page));
    yield put(myEventListActions.setSize(size));

    const response = yield call(getMany, page, size, filter);
    yield put(myEventListActions.setIsChangingPage(false));

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
