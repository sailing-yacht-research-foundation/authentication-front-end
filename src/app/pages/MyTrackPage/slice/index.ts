import { PayloadAction } from '@reduxjs/toolkit';
import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import myTracksSaga from './saga';
import { TrackState } from './types';

export const initialState: TrackState = {
    isDeletingTrack: false,
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
    name: 'track',
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
        setIsDeletingTrack(state, action: PayloadAction<boolean>) {
            state.isDeletingTrack = action.payload;
        },
        getTracks(state, action: PayloadAction<any> ) { }
    },
});

export const { actions: trackActions, reducer } = slice;

export const useMyTracksSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: myTracksSaga });
    return { actions: slice.actions };
};
