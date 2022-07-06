import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { TableFilteringType } from 'utils/constants';
import * as slice from '..';
import { ContainerState } from '../types';

describe('My tracks slice', () => {
    let state: ContainerState;

    beforeEach(() => {
        state = slice.initialState;
    });

    it('should return the initial state', () => {
        expect(slice.reducer(undefined, { type: '' })).toEqual(state);
    });

    it('should handle setPagination', () => {
        const pagination = {
            page: 1,
            total: 0,
            rows: [],
            size: 10
        };
        expect(
            slice.reducer(state, slice.trackActions.setPagination(pagination)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            pagination: pagination,
        });
    });

    it('should handle setFilter', () => {
        const filter: TableFiltering = {
            key: '',
            value: '',
            type: TableFilteringType.TEXT
        };
        expect(
            slice.reducer(state, slice.trackActions.setFilter(filter)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            filter: [filter]
        });
    });

    it('should handle setIsLoading', () => {
        const isLoading = false;
        expect(
            slice.reducer(state, slice.trackActions.setIsLoading(isLoading)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            isLoading: isLoading
        });
    });

    it('should handle setSorter', () => {
        const sorter: TableSorting = { key: '', order: 'desc' };
        expect(
            slice.reducer(state, slice.trackActions.setSorter(sorter)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            sorter: sorter
        });
    });
});
