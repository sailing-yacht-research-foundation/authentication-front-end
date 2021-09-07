/**
 * Root saga manages watcher lifecycle
 */

import { homeActions } from ".";
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { search } from "services/live-data-server/competition-units";
import { toast } from "react-toastify";
import i18next from 'i18next';
import { translations } from "locales/translations";
import { selectSearchKeyword } from "./selectors";

export function* searchRaces(action) {
    const params = action.payload;

    yield put(homeActions.setIsSearching(true));

    const response = yield call(search, params);
    const searchKeyword = yield select(selectSearchKeyword);

    yield put(homeActions.setIsSearching(false));

    if (response.data) {
        if (response.data?.hits?.total?.value === 0) {
            toast.info(i18next.t(translations.home_page.search_performed_no_result_found, { keyword: searchKeyword }));
            yield put(homeActions.setMapResults([]));
            yield put(homeActions.setResults([]));
        } else {
            yield put(homeActions.setTotal(response.data?.hits.total?.value));
            yield put(homeActions.setMapResults(response.data?.hits?.hits));
            if (params.get_all) {
                yield put(homeActions.setResults(response.data?.hits?.hits.slice(0, 10)));
            } else {
                yield put(homeActions.setResults(response.data?.hits?.hits));
            }
        }
    }
}

export default function* homeSaga() {
    yield takeLatest(homeActions.searchRaces.type, searchRaces);
}
