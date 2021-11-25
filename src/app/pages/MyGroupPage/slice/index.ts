import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import groupSaga from './saga';
import { GroupState } from './types';

export const initialState: GroupState = {
    groupCurrentPage: 1,
    groupTotalPage: 0,
    invitationsCurrentPage: 1,
    invitationsTotalPage: 0,
    invitations: [],
    groups: [],
    isChangingPage: false,
    isLoading: false,
    groupResults: [],
    searchKeyword: '',
    groupSearchCurrentPage: 1,
    groupSearchTotalPage: 1,
    requestedGroupTotalPage: 1,
    requestedGroupsCurrentPage: 1,
    requestedGroups: [],
    isGettingRequestedGroups: false,
    isModalLoading: false
};

const slice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setInvitations(state, action: PayloadAction<any[]>) {
            state.invitations = action.payload;
        },
        setGroups(state, action: PayloadAction<any[]>) {
            state.groups = action.payload;
        },
        setCurrentGroupPage(state, action: PayloadAction<number>) {
            state.groupCurrentPage = action.payload;
        },
        setCurrentInvitationPage(state, action: PayloadAction<number>) {
            state.invitationsCurrentPage = action.payload;
        },
        setGroupTotalPage(state, action: PayloadAction<number>) {
            state.groupTotalPage = action.payload;
        },
        setInvitationTotalPage(state, action: PayloadAction<number>) {
            state.invitationsTotalPage = action.payload;
        },
        setIsChangingPage(state, action: PayloadAction<boolean>) {
            state.isChangingPage = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        getGroups(state, action: PayloadAction<number>) {},
        getGroupInvitations(state, action: PayloadAction<any>) {},
        searchForGroups(state, action: PayloadAction<any>) {},
        setSearchKeyword(state, action: PayloadAction<string>) {
            state.searchKeyword = action.payload;
        },
        setSearchResults(state, action: PayloadAction<any[]>) {
            state.groupResults = action.payload;
        },
        setSearchCurrentPage(state, action: PayloadAction<number>) {
            state.groupSearchCurrentPage = action.payload;
        },
        setSearchTotalPage(state, action: PayloadAction<number>) {
            state.groupSearchTotalPage = action.payload;
        },
        setRequestedGroups(state, action: PayloadAction<any[]>) {
            state.requestedGroups = action.payload;
        },
        setRequestedGroupCurrentPage(state, action: PayloadAction<number>) {
            state.requestedGroupsCurrentPage = action.payload;
        },
        setRequestedGroupTotalPage(state, action: PayloadAction<number>) {
            state.requestedGroupTotalPage = action.payload;
        },
        getRequestedGroups(state, action: PayloadAction<number>) {},
        setisGettingRequestedGroups(state, action: PayloadAction<boolean>) {
            state.isGettingRequestedGroups = action.payload;
        },
        setIsModalLoading(state, action: PayloadAction<boolean>) {
            state.isModalLoading = action.payload;
        }
    },
});

export const { actions: groupActions, reducer } = slice;

export const useGroupSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: groupSaga });
    return { actions: slice.actions };
};
