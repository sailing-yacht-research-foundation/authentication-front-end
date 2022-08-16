import { PayloadAction } from '@reduxjs/toolkit';
import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import vesselListSaga from './saga';
import { VesselListState } from './types';

export const initialState: VesselListState = {
    isLoading: false,
    pagination: {
        page: 1,
        total: 0,
        rows: [],
        size: 10
    },
    filter: [],
    sorter: {}
};

const slice = createSlice({
    name: 'vesselList',
    initialState,
    reducers: {
        setPagination(state, action: PayloadAction<any>) {
            state.pagination = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setFilter(state, action: PayloadAction<TableFiltering>) {
            const filter = state.filter;
            state.filter = [...filter.filter(item => item.key !== action.payload?.key), action.payload];
        },
        setSorter(state, action: PayloadAction<Partial<TableSorting>>) {
            state.sorter = action.payload;
        },
        clearFilter(state, action: PayloadAction<string>) {
            const filter = state.filter;
            state.filter = filter.filter(item => item.key !== action.payload);
        },
        getVessels(state, action: PayloadAction<any> ) { }
    },
});

export const { actions: vesselListActions, reducer } = slice;

export const useVesselListSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: vesselListSaga });
    return { actions: slice.actions };
};
