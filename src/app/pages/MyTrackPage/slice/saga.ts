/**
 * Root saga manages watcher lifecycle
 */

import { call, put, takeLatest } from "@redux-saga/core/effects";
import { getAllTracks } from "services/live-data-server/my-tracks";
import { trackActions } from ".";

export function* getTracks({ type, payload }) {
    const { page, size, filter, sorter } = payload;

    yield put(trackActions.setIsLoading(true));
    const response = yield call(getAllTracks, page, size, filter, sorter);
    yield put(trackActions.setIsLoading(false));

    if (response.success) {
        yield put(trackActions.setPagination({
            rows: response.data?.rows,
            page: page,
            total: response.data?.count,
            size: response.data?.size
        }));
    }
}

export default function* myTracksSaga() {
    yield takeLatest(trackActions.getTracks.type, getTracks);
}
