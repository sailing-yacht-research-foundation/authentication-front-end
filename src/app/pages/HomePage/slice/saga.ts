/**
 * Root saga manages watcher lifecycle
 */

import { homeActions } from ".";
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getLiveAndUpcomingRaces, search } from "services/live-data-server/competition-units";
import { toast } from "react-toastify";
import i18next from 'i18next';
import { translations } from "locales/translations";
import { selectSearchKeyword } from "./selectors";
import { showToastMessageOnRequestError } from "utils/helpers";

export function* searchRaces(action) {
    const params = action.payload;

    yield put(homeActions.setNoResultsFound(false));
    yield put(homeActions.setIsSearching(true));

    const response = yield call(search, params);
    const searchKeyword = yield select(selectSearchKeyword);

    yield put(homeActions.setIsSearching(false));

    if (response.success) {
        if (response.data?.hits?.total?.value === 0) {
            toast.info(i18next.t(translations.home_page.search_performed_no_result_found, { keyword: params.keyword }));
            yield put(homeActions.setResults([]));
            yield put(homeActions.setTotal(0));
            yield put(homeActions.setNoResultsFound(true));
        } else {
            yield put(homeActions.setTotal(response.data?.hits.total?.value));
            yield put(homeActions.setResults(response.data?.hits?.hits));
        }
    } else {
        const priotizedErrorMessage = response.error?.response?.data?.data?.error?.root_cause[0]?.reason;
        showToastMessageOnRequestError(response.error, priotizedErrorMessage);
    }

    window?.history?.pushState('', 'syrf.io', '/?' + Object.entries({...params, keyword: searchKeyword }).map(([key, val]) => `${key}=${val}`).join('&'));
}

export function* getUpcomingRaces(action) {
    const { duration, coordinate, distance, page, size } = action.payload;

    const response = yield call(getLiveAndUpcomingRaces, duration, distance, page, size, coordinate);

    yield put(homeActions.setUpcomingResultDistance(distance));
    yield put(homeActions.setUpcomingResultDuration(duration));
    yield put(homeActions.setUpComingResultPage(page));
    yield put(homeActions.setUpcomingResultPageSize(size));

    if (response.success) {
        if (response.data?.hits?.total?.value === 0) {
            yield put(homeActions.setUpcomingRaceResults([]));
            yield put(homeActions.setUpcomingResultTotal(0));
        } else {
            yield put(homeActions.setUpcomingResultTotal(response.data?.hits.total?.value));
            yield put(homeActions.setUpcomingRaceResults(response.data?.hits?.hits));
        }
    } else {
        const priotizedErrorMessage = response.error?.response?.data?.data?.error?.root_cause[0]?.reason;
        showToastMessageOnRequestError(response.error, priotizedErrorMessage);
    }
}

export default function* homeSaga() {
    yield takeLatest(homeActions.searchRaces.type, searchRaces);
    yield takeLatest(homeActions.getLiveAndUpcomingRaces.type, getUpcomingRaces);
}
