import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { TableFilteringType } from 'utils/constants';
import * as slice from '..';
import { ContainerState } from '../types';

describe('useMyEventListSlice', () => {
    let state: ContainerState;

    beforeEach(() => {
        state = slice.initialState;
    });

    it('should return the initial state', () => {
        expect(slice.reducer(undefined, { type: '' })).toEqual(state);
    });

    it('should handle setResults', () => {
        expect(
            slice.reducer(state, slice.myEventListActions.setResults([])),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            results: []
        });
    });

    it('should handle setTotal', () => {
        const total = 23;
        expect(
            slice.reducer(state, slice.myEventListActions.setTotal(total)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            total: total
        });
    });

    it('should handle setPage', () => {
        const page = 4;
        expect(
            slice.reducer(state, slice.myEventListActions.setPage(page)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            page: page
        });
    });

    it('should handle setSize', () => {
        const size = 10;
        expect(
            slice.reducer(state, slice.myEventListActions.setSize(size)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            size: 10
        });
    });

    it('should handle setIsChangingPage', () => {
        const isChangingPage = true;
        expect(
            slice.reducer(state, slice.myEventListActions.setIsChangingPage(isChangingPage)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            is_changing_page: true
        });
    });

    it('should handle setFilter', () => {
        const filter: TableFiltering = { key: '', value: '', type: TableFilteringType.TEXT };
        expect(
            slice.reducer(state, slice.myEventListActions.setFilter(filter)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            filter: [filter]
        });
    });

    it('should handle setSorter', () => {
        const sorter: TableSorting = { key: '', order: 'esc' }
        expect(
            slice.reducer(state, slice.myEventListActions.setSorter(sorter)),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            sorter: sorter
        });
    });

    it('should handle clearFilter', () => {
        expect(
            slice.reducer(state, slice.myEventListActions.clearFilter('')),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            filter: []
        });
    });

    it('should handle clearEventsListData', () => {
        expect(
            slice.reducer(state, slice.myEventListActions.clearEventsListData()),
        ).toEqual<ContainerState>({
            ...slice.initialState,
            results: [],
            page: 1,
            total: 0
        });
    });
});
