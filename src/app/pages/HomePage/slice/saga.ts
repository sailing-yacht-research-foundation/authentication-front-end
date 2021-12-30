/**
 * Root saga manages watcher lifecycle
 */

import { homeActions } from ".";
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { search } from "services/live-data-server/competition-units";
import { toast } from "react-toastify";
import i18next from 'i18next';
import { translations } from "locales/translations";
import { selectSearchKeyword } from "./selectors";
import { showToastMessageOnRequestError } from "utils/helpers";

export function* searchRaces(action) {
    const params = action.payload;

    yield put(homeActions.setIsSearching(true));

    const response = yield call(search, params);
    const searchKeyword = yield select(selectSearchKeyword);

    yield put(homeActions.setIsSearching(false));

    if (response.success) {
        if (response.data?.hits?.total?.value === 0) {
            toast.info(i18next.t(translations.home_page.search_performed_no_result_found, { keyword: searchKeyword }));
            yield put(homeActions.setResults([]));
            yield put(homeActions.setTotal(0));
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

export default function* homeSaga() {
    yield takeEvery(homeActions.searchRaces.type, searchRaces);
}
