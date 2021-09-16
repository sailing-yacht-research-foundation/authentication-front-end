/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest, select } from "@redux-saga/core/effects";
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { getMany } from "services/live-data-server/event-calendars";
import { myEventListActions } from ".";

export function* getEvents(action) {
    const user = yield select(selectUser);

    yield put(myEventListActions.setIsChangingPage(true));

    const response = yield call(getMany, action.payload, user);

    yield put(myEventListActions.setIsChangingPage(false));
    yield put(myEventListActions.setPage(action.payload));

    if (response.success) {
        if (response.data?.count > 0) {
            yield put(myEventListActions.setResults(response.data?.rows));
            yield put(myEventListActions.setTotal(response.data?.count));
        }
    }
}

export default function* myEventListSaga() {
    yield takeLatest(myEventListActions.getEvents.type, getEvents);
}
