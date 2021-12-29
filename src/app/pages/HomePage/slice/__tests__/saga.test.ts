import { call, put, select, takeEvery } from 'redux-saga/effects';
import { search } from 'services/live-data-server/competition-units';
import * as slice from '..';

import homeSaga, { searchRaces } from '../saga';
import { selectSearchKeyword } from '../selectors';

describe('home Saga', () => {
    let searchRaceIterator: ReturnType<typeof searchRaces>;

    // We have to test twice, once for a successful load and once for an unsuccessful one
    // so we do all the stuff that happens beforehand automatically in the beforeEach
    beforeEach(() => {
        searchRaceIterator = searchRaces({
            payload: {
                keyword: 'east'
            }
        });
    });

    it('should set races if races are returned from server', () => {
        const response = {
            success: true,
            data: {
                hits: {
                    hits: [],
                    total: {
                        value: 5
                    }
                }
            }
        };

        const params = {
            keyword: 'east'
        };
        let searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(true)),
        );

        const callDescriptor = searchRaceIterator.next(params).value;

        expect(callDescriptor).toEqual(
            call(search, params),
        );

        const selectDescriptor = searchRaceIterator.next(response).value;
        expect(selectDescriptor).toEqual(
            select(selectSearchKeyword),
        );

        searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(false)),
        );

        let putDescriptor = searchRaceIterator.next().value;

        expect(putDescriptor).toEqual(
            put(slice.homeActions.setTotal(response.data?.hits.total.value))
        );

        putDescriptor = searchRaceIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.homeActions.setResults(response.data?.hits.hits))
        );

        const iteration = searchRaceIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('should not set races if races if results count is zero', () => {
        const response = {
            success: true,
            data: {
                hits: {
                    hits: [],
                    total: {
                        value: 0
                    }
                }
            }
        };

        const params = {
            keyword: 'east'
        };
        let searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(true)),
        );

        const callDescriptor = searchRaceIterator.next(params).value;
        expect(callDescriptor).toEqual(
            call(search, params),
        );

        const selectDescriptor = searchRaceIterator.next(response).value;
        expect(selectDescriptor).toEqual(
            select(selectSearchKeyword),
        );

        searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(false)),
        );

        searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setResults([])),
        );

        let putDescriptor = searchRaceIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.homeActions.setTotal(0))
        );

        const iteration = searchRaceIterator.next();
        expect(iteration.done).toBe(true);
    });
});

describe('home Saga Init', () => {
    const homeIterator = homeSaga();
    it('should start task to watch for searchRaces action', () => {
        const takeLatestDescriptor = homeIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeEvery(slice.homeActions.searchRaces.type, searchRaces),
        );
    });
});