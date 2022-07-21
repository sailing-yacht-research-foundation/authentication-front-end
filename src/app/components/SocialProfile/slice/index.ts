import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import socialSaga from './saga';
import { SocialProfileState } from './types';

export const initialState: SocialProfileState = {
    showFollowRequestModal: false,
    pagination: {
        page: 1,
        total: 0,
        rows: [],
        size: 10
    },

};

const slice = createSlice({
    name: 'social',
    initialState,
    reducers: {
        setShowFollowRequestModal(state, action: PayloadAction<boolean>) {
            state.showFollowRequestModal = action.payload;
        },
        setPagination(state, action: PayloadAction<any>) {
            state.pagination = action.payload;
        },
        getFollowRequests(state, action: PayloadAction<any>) {}
    },
});

export const { actions: socialActions, reducer } = slice;

export const useSocialSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: socialSaga });
    return { actions: slice.actions };
};
