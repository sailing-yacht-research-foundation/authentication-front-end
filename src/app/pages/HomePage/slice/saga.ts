/**
 * Root saga manages watcher lifecycle
 */

import { homeActions } from ".";
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { checkForUserRelationWithCompetitionUnits, getLiveAndUpcomingRaces, search } from "services/live-data-server/competition-units";
import { toast } from "react-toastify";
import i18next from 'i18next';
import { translations } from "locales/translations";
import { selectSearchKeyword } from "./selectors";
import { showToastMessageOnRequestError } from "utils/helpers";

export function* searchRaces(action) {
    const params = action.payload;

    yield put(homeActions.setNoResultsFound(false));
    yield delay(100); // delay for taking time to append selected criteria
    yield put(homeActions.setIsSearching(true));

    const searchKeyword = yield select(selectSearchKeyword);
    const response = yield call(search, { ...params, keyword: searchKeyword });
    yield put(homeActions.setIsSearching(false));

    if (response.success) {
        if (response.data?.hits?.total?.value === 0) {
            toast.info(i18next.t(translations.home_page.search_performed_no_result_found, { keyword: searchKeyword }));
            yield put(homeActions.setResults([]));
            yield put(homeActions.setTotal(0));
            yield put(homeActions.setNoResultsFound(true));
        } else {
            const results = response.data?.hits?.hits;
            yield put(homeActions.setTotal(response.data?.hits.total?.value));
            yield put(homeActions.setResults(results));
            yield put(homeActions.getRelationWithCompetitionUnits(results.map(r => r._source?.id)));
        }
    } else {
        const priotizedErrorMessage = response.error?.response?.data?.data?.error?.root_cause[0]?.reason;
        showToastMessageOnRequestError(response.error, priotizedErrorMessage);
    }

    window?.history?.pushState('', 'syrf.io', '/?' + Object.entries({ ...params, keyword: searchKeyword }).map(([key, val]) => `${key}=${val}`).join('&'));
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
            const results = response.data?.hits?.hits;
            yield put(homeActions.setUpcomingResultTotal(response.data?.hits.total?.value));
            yield put(homeActions.setUpcomingRaceResults(results));
            yield put(homeActions.getRelationWithCompetitionUnits(results.map(r => r._source?.id)));
        }
    } else {
        const priotizedErrorMessage = response.error?.response?.data?.data?.error?.root_cause[0]?.reason;
        showToastMessageOnRequestError(response.error, priotizedErrorMessage);
    }
}

export function* getUserRelationsWithCompetitionUnits(action) {
    const competitionUnitsIds = action.payload;

    const response = yield call(checkForUserRelationWithCompetitionUnits, competitionUnitsIds);

    if (response.success) {
        yield put(homeActions.setRelationWithCompetitionUnits(response.data));
    }
}

export default function* homeSaga() {
    yield takeLatest(homeActions.searchRaces.type, searchRaces);
    yield takeLatest(homeActions.getLiveAndUpcomingRaces.type, getUpcomingRaces);
    yield takeLatest(homeActions.getRelationWithCompetitionUnits.type, getUserRelationsWithCompetitionUnits);
}
