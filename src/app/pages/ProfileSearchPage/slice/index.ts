import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import profileSearchSaga from './saga';
import { ProfileSearchState } from './types';

export const initialState: ProfileSearchState = {
    results: [],
    isSearching: false
};

const slice = createSlice({
    name: 'profileSearch',
    initialState,
    reducers: {
        setResults(state, action: PayloadAction<any[]>) {
            state.results = action.payload;
        },
        setIsSearching(state, action: PayloadAction<boolean>) {
            state.isSearching = action.payload;
        },
        searchProfiles(state, action: PayloadAction<any>) {},
        clearStateData(state) {
            state.results = [];
        }
    },
});

export const { actions: profileSearchActions, reducer } = slice;

export const useProfileSearchSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: profileSearchSaga });
    return { actions: slice.actions };
};
