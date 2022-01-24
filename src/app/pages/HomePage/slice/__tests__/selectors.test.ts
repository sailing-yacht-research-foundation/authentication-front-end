import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('Homepage selectors', () => {
    let state: RootState = {};

    beforeEach(() => {
        state = {};
    });

    it('should select from_date', () => {
        const fromDate = '2021-08-20';
        state = {
            home: { ...initialState, fromDate: '2021-08-20' },
        };
        expect(selectors.selectFromDate(state)).toEqual(fromDate);
    });


    it('should select to_date', () => {
        const toDate = '2021-08-20';
        state = {
            home: { ...initialState, toDate: '2021-08-20' },
        };
        expect(selectors.selectToDate(state)).toEqual(toDate);
    });

    it('should select is_searching', () => {
        const isSearching = false;
        state = {
            home: { ...initialState, isSearching: false },
        };
        expect(selectors.selectIsSearching(state)).toEqual(isSearching);
    });

    it('should select is_searching', () => {
        const keyword = 'east';
        state = {
            home: { ...initialState, keyword: 'east' },
        };
        expect(selectors.selectSearchKeyword(state)).toEqual(keyword);
    });

    it('should select page', () => {
        const page = 3;
        state = {
            home: { ...initialState, page: 3 },
        };
        expect(selectors.selectPage(state)).toEqual(page);
    });

    it('should select results array', () => {
        const results = [];
        state = {
            home: { ...initialState, results: [] },
        };
        expect(selectors.selectResults(state)).toEqual(results);
    });

    it('should select upcoming races', () => {
        const races = [{
            name: 'some races'
        }];
        state = {
            home: { ...initialState, upcomingResults: races },
        };
        expect(selectors.selectUpcomingRaces(state)).toEqual(races);
    });

    it('should select total upcoming races', () => {
        const totalResults = 5;
        state = {
            home: { ...initialState, upcomingResultTotal: 5 },
        };
        expect(selectors.selectUpcomingRaceTotal(state)).toEqual(totalResults);
    });

    it('should select current upcoming page search', () => {
        const currentPage = 1;
        state = {
            home: { ...initialState, upcomingResultPage: currentPage },
        };
        expect(selectors.selectUpcomingRacePage(state)).toEqual(currentPage);
    });

    it('should select upcoming races search pagesize', () => {
        const pageSize = 10;
        state = {
            home: { ...initialState, pageSize: 10 },
        };
        expect(selectors.selectUpcomingRacePageSize(state)).toEqual(pageSize);
    });

    it('should select distance of upcoming races', () => {
        const distance = 5;
        state = {
            home: { ...initialState, upcomingResultDistance: distance },
        };
        expect(selectors.selectUpcomingRaceDistanceCriteria(state)).toEqual(distance);
    });

    it('should select duration of upcoming races', () => {
        const duration = 1; // month
        state = {
            home: { ...initialState, upcomingResultDuration: duration },
        };
        expect(selectors.selectUpcomingRaceDurationCriteria(state)).toEqual(duration);
    });
});
