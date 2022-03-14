import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { getLiveAndUpcomingRaces, search } from 'services/live-data-server/competition-units';
import * as slice from '..';

import homeSaga, { searchRaces, getUpcomingRaces } from '../saga';
import { selectSearchKeyword } from '../selectors';

describe('home Saga', () => {
    let searchRaceIterator: ReturnType<typeof searchRaces>;
    let getUpcomingRaceIterator: ReturnType<typeof getUpcomingRaces>;
    const getRaceParams = {
        page: 1,
        size: 10,
        duration: 1,
        distance: 5,
        coordinate: {
            lon: 1,
            lat: 1
        }
    }

    // We have to test twice, once for a successful load and once for an unsuccessful one
    // so we do all the stuff that happens beforehand automatically in the beforeEach
    beforeEach(() => {
        searchRaceIterator = searchRaces({
            payload: {
                keyword: 'east'
            }
        });

        getUpcomingRaceIterator = getUpcomingRaces({
            payload: getRaceParams
        })
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
            put(slice.homeActions.setNoResultsFound(false)),
        );

        expect(searchRaceIterator.next().value).toEqual(
            delay(100),
        );

        expect(searchRaceIterator.next().value).toEqual(
            put(slice.homeActions.setIsSearching(true)),
        );

        const selectDescriptor = searchRaceIterator.next(response).value;
        expect(selectDescriptor).toEqual(
            select(selectSearchKeyword),
        );

        const callDescriptor = searchRaceIterator.next(params).value;

        expect(callDescriptor).toEqual(
            call(search, {...params, keyword: 'east'}),
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

        putDescriptor = searchRaceIterator.next().value;
        expect(putDescriptor).toEqual(
            put(slice.homeActions.getRelationWithCompetitionUnits([]))
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
            put(slice.homeActions.setNoResultsFound(false)),
        );

        expect(searchRaceIterator.next().value).toEqual(
            delay(100),
        );

        expect(searchRaceIterator.next().value).toEqual(
            put(slice.homeActions.setIsSearching(true)),
        );

        const selectDescriptor = searchRaceIterator.next(response).value;
        expect(selectDescriptor).toEqual(
            select(selectSearchKeyword),
        );

        const callDescriptor = searchRaceIterator.next(params).value;
        expect(callDescriptor).toEqual(
            call(search, {...params, keyword: 'east'}),
        );

        searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setIsSearching(false)),
        );

        searchRacePutDescriptor = searchRaceIterator.next().value;
        expect(searchRacePutDescriptor).toEqual(
            put(slice.homeActions.setResults([])),
        );

        let putDescriptorSetTotal = searchRaceIterator.next().value;
        expect(putDescriptorSetTotal).toEqual(
            put(slice.homeActions.setTotal(0))
        );

        let putDescriptorSetNoResultFound = searchRaceIterator.next().value;
        expect(putDescriptorSetNoResultFound).toEqual(
            put(slice.homeActions.setNoResultsFound(true))
        );

        const iteration = searchRaceIterator.next();
        expect(iteration.done).toBe(true);
    });

    it('should get upcoming races', () => {
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
        
        const callDescriptor = getUpcomingRaceIterator.next().value;
        expect(callDescriptor).toEqual(
            call(getLiveAndUpcomingRaces, getRaceParams.duration, getRaceParams.distance, getRaceParams.page, getRaceParams.size, getRaceParams.coordinate),
        );

        const putSetUpcomingRaceResultDistanceDescriptor = getUpcomingRaceIterator.next(response).value;
        expect(putSetUpcomingRaceResultDistanceDescriptor).toEqual(
            put(slice.homeActions.setUpcomingResultDistance(getRaceParams.distance)),
        );

        const putSetUpcomingRaceResultDurationDescriptor = getUpcomingRaceIterator.next().value;
        expect(putSetUpcomingRaceResultDurationDescriptor).toEqual(
            put(slice.homeActions.setUpcomingResultDuration(getRaceParams.duration))
        );

        const putSetUpcomingResultPageDescriptor = getUpcomingRaceIterator.next().value;
        expect(putSetUpcomingResultPageDescriptor).toEqual(
            put(slice.homeActions.setUpComingResultPage(getRaceParams.page))
        );

        const putSetUpcomingResultPageSizeDescriptor = getUpcomingRaceIterator.next().value;
        expect(putSetUpcomingResultPageSizeDescriptor).toEqual(
            put(slice.homeActions.setUpcomingResultPageSize(getRaceParams.size))
        );

        const putSetUpcomingResultsDescriptor = getUpcomingRaceIterator.next().value;
        expect(putSetUpcomingResultsDescriptor).toEqual(
            put(slice.homeActions.setUpcomingRaceResults([])),
        );

        const putDescriptorSetTotal = getUpcomingRaceIterator.next().value;
        expect(putDescriptorSetTotal).toEqual(
            put(slice.homeActions.setUpcomingResultTotal(0))
        );

        const iteration = getUpcomingRaceIterator.next();
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

    it('should start task to watch for getLiveAndUpcomingRaces action', () => {
        const takeLatestDescriptor = homeIterator.next().value;
        expect(takeLatestDescriptor).toEqual(
            takeLatest(slice.homeActions.getLiveAndUpcomingRaces.type, getUpcomingRaces),
        );
    });
});