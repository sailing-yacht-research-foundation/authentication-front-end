/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getMany } from "services/live-data-server/event-calendars";
import { myRaceListActions } from ".";

export function* getRaces(action) {
    yield put(myRaceListActions.setIsChangingPage(true));

    const response = yield call(getMany, action.payload);

    yield put(myRaceListActions.setIsChangingPage(false));
    yield put(myRaceListActions.setPage(action.payload));

    if (response.success) {
        if (response.data?.count > 0) {
            yield put(myRaceListActions.setResults(response.data?.rows));
            yield put(myRaceListActions.setTotal(response.data?.count));
        }
    }
}

export default function* myRaceListSaga() {
    yield takeLatest(myRaceListActions.getRaces.type, getRaces);
}
