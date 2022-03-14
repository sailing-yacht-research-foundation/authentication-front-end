import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer } from 'utils/redux-injectors';
import { SocialProfileState } from './types';

export const initialState: SocialProfileState = {
    showFollowRequestModal: false,
};

const slice = createSlice({
    name: 'social',
    initialState,
    reducers: {
        setShowFollowRequestModal(state, action: PayloadAction<boolean>) {
            state.showFollowRequestModal = action.payload;
        }
    },
});

export const { actions: socialActions, reducer } = slice;

export const useSocialSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};
