import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import publicProfileSaga from './saga';
import { PublicProfileState } from './types';

export const initialState: PublicProfileState = {
    profile: {},
    followers: [],
    following: [],
    currentFollowerPage: 1,
    currentFollowingPage: 1,
    followerTotalRecords: 0,
    followingTotalRecords: 0,
    isModalLoading: false,
    followerTotalPage: 0,
    followingTotalPage: 0,
    getProfileFailed: false,
    isLoadingProfile: false,
};

const slice = createSlice({
    name: 'publicProfile',
    initialState,
    reducers: {
        getProfile(state, action: PayloadAction<any>) { },
        getFollowers(state, action: PayloadAction<any>) { },
        getFollowing(state, action: PayloadAction<any>) { },
        setProfile(state, action: PayloadAction<any>) {
            state.profile = action.payload;
        },
        setFollowers(state, action: PayloadAction<any[]>) {
            state.followers = action.payload;
        },
        setFollowing(state, action: PayloadAction<any[]>) {
            state.following = action.payload;
        },
        setCurrentFollowerPage(state, action: PayloadAction<number>) {
            state.currentFollowerPage = action.payload;
        },
        setCurrentFollowingPage(state, action: PayloadAction<number>) {
            state.currentFollowingPage = action.payload;
        },
        setTotalFollowerRecords(state, action: PayloadAction<number>) {
            state.followerTotalRecords = action.payload;
        },
        setTotalFollowingRecords(state, action: PayloadAction<number>) {
            state.followingTotalRecords = action.payload;
        },
        setModalLoading(state, action: PayloadAction<boolean>) {
            state.isModalLoading = action.payload;
        },
        setFollowerTotalPage(state, action: PayloadAction<number>) {
            state.followerTotalPage = action.payload;
        },
        setFollowingTotalPage(state, action: PayloadAction<number>) {
            state.followingTotalPage = action.payload;
        },
        setGetProfileFailed(state, action: PayloadAction<boolean>) {
            state.getProfileFailed = action.payload;
        },
        setIsLoadingProfile(state, action: PayloadAction<boolean>) {
            state.isLoadingProfile = action.payload;
        }
    },
});

export const { actions: publicProfileActions, reducer } = slice;

export const usePublicProfileSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: publicProfileSaga });
    return { actions: slice.actions };
};
