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
            home: { ...initialState, from_date: '2021-08-20' },
        };
        expect(selectors.selectFromDate(state)).toEqual(fromDate);
    });


    it('should select to_date', () => {
        const toDate = '2021-08-20';
        state = {
            home: { ...initialState, to_date: '2021-08-20' },
        };
        expect(selectors.selectToDate(state)).toEqual(toDate);
    });

    it('should select is_searching', () => {
        const isSearching = false;
        state = {
            home: { ...initialState, is_searching: false },
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

    it('should select total result', () => {
        const totalResults = 2000;
        state = {
            home: { ...initialState, total: 2000 },
        };
        expect(selectors.selectTotal(state)).toEqual(totalResults);
    });
});
