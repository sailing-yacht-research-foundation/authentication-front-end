import { call, put, select, takeLatest } from 'redux-saga/effects';
import { list } from 'services/live-data-server/event-calendars';
import * as slice from '..';

import homeSaga, { searchRaces } from '../saga';
import { selectSearchKeyword } from '../selectors';

describe('home Saga', () => {
    let searchRaceIterator: ReturnType<typeof searchRaces>;

    // We have to test twice, once for a successful load and once for an unsuccessful one
    // so we do all the stuff that happens beforehand automatically in the beforeEach
    beforeEach(() => {
        searchRaceIterator = searchRaces({ keyword: 'east' });
    });

    it('should set races if races are returned from server', () => {
        const response = {
            data: {
                rows: [],
                count: 1
            }
        };

        const params = {
            keyword: 'east'
        };
        let searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(true)),
        );

        const callDescriptor = searchRaceIterator.next().value;
        expect(callDescriptor).toEqual(
            call(list, params),
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
            put(slice.homeActions.setResults(response.data?.rows))
        );

        putDescriptor = searchRaceIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.homeActions.setTotal(response.data?.count))
        );


        const iteration = searchRaceIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('should not set races if races if results count is zero', () => {
        const response = {
            data: {
                rows: [],
                count: 0
            }
        };

        const params = {
            keyword: 'east'
        };
        let searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(true)),
        );

        const callDescriptor = searchRaceIterator.next().value;
        expect(callDescriptor).toEqual(
            call(list, params),
        );

        const selectDescriptor = searchRaceIterator.next(response).value;
        expect(selectDescriptor).toEqual(
            select(selectSearchKeyword),
        );

        searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(false)),
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
      takeLatest(slice.homeActions.searchRaces.type, searchRaces),
    );
  });
});