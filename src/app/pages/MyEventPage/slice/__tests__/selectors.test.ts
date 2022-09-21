import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';
import { TableFiltering } from 'types/TableFiltering';
import { TableFilteringType } from 'utils/constants';
import { TableSorting } from 'types/TableSorting';

describe('MyEvents selectors', () => {
    let state: RootState;

    beforeEach(() => {
        state = {};
    });

    it('should select selectResults', () => {
        const results = [];
        state = {
            myEventList: { ...initialState, results: [] },
        };
        expect(selectors.selectResults(state)).toEqual(results);
    });


    it('should handle selectTotal', () => {
        const total = 5;
        state = {
            myEventList: { ...initialState, total: total },
        };
        expect(selectors.selectTotal(state)).toEqual(total);
    });

    it('should handle selectPage', () => {
        const page = 1;
        state = {
            myEventList: { ...initialState, page: page },
        };
        expect(selectors.selectPage(state)).toEqual(page);
    });

    it('should handle selectIsChangingPage', () => {
        const isChangingPage = true;
        state = {
            myEventList: { ...initialState, is_changing_page: isChangingPage },
        };
        expect(selectors.selectIsChangingPage(state)).toEqual(isChangingPage);
    });

    it('should handle selectPageSize', () => {
        const pageSize = 10;
        state = {
            myEventList: { ...initialState, size: pageSize },
        };
        expect(selectors.selectPageSize(state)).toEqual(pageSize);
    });

    it('should handle selectFilter', () => {
        const filter: TableFiltering = {  key: '', type: TableFilteringType.TEXT, value: '' };
        state = {
            myEventList: { ...initialState, filter: [filter] },
        };
        expect(selectors.selectFilter(state)).toEqual([filter]);
    });

    it('should handle selectSorter', () => {
        const sorter: TableSorting = { key: '', order: 'esc' }
        state = {
            myEventList: { ...initialState, sorter: sorter },
        };
        expect(selectors.selectSorter(state)).toEqual(sorter);
    });
});
