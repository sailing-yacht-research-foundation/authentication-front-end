import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('Mt tracks selectors', () => {
    let state: RootState;

    beforeEach(() => {
        state = {};
    });

    it('should select pagination', () => {
        const pagination = {};
        state = {
            track: { ...initialState, pagination: pagination },
        };
        expect(selectors.selectPagination(state)).toEqual(pagination);
    });


    it('should handle selectSorter', () => {
        const sorter = {};
        state = {
            track: { ...initialState, sorter: sorter },
        };
        expect(selectors.selectSorter(state)).toEqual(sorter);
    });

    it('should handle selectFilter', () => {
        const filter = [];
        state = {
            track: { ...initialState, filter: [] },
        };
        expect(selectors.selectFilter(state)).toEqual(filter);
    });

    it('should handle selectIsLoading', () => {
        const isLoading = true;
        state = {
            track: { ...initialState, isLoading: isLoading },
        };
        expect(selectors.selectIsLoading(state)).toEqual(isLoading);
    });

});
