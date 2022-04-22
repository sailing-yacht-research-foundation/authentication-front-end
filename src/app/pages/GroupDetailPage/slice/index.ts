import { PayloadAction } from '@reduxjs/toolkit';
import { Group, GroupMember } from 'types/Group';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import groupDetailSaga from './saga';
import { GroupDetailState } from './types';

export const initialState: GroupDetailState = {
    adminCurrentPage: 1,
    memberCurrentPage: 1,
    adminTotal: 0,
    memberTotal: 0,
    admins: [],
    members: [],
    isGettingAdmins: false,
    isGettingMembers: false,
    group: {},
    isGetGroupDetailFailed: false,
    isGettingGroup: false,
    acceptedMemberResults: [],
    memberPageSize: 10,
    adminPageSize: 10,
};

const slice = createSlice({
    name: 'groupDetail',
    initialState,
    reducers: {
        setAdmins(state, action: PayloadAction<GroupMember[]>) {
            state.admins = action.payload;
        },
        setMembers(state, action: PayloadAction<GroupMember[]>) {
            state.members = action.payload;
        },
        setCurrentMemberPage(state, action: PayloadAction<number>) {
            state.memberCurrentPage = action.payload;
        },
        setCurrentAdminPage(state, action: PayloadAction<number>) {
            state.adminCurrentPage = action.payload;
        },
        setAdminTotal(state, action: PayloadAction<number>) {
            state.adminTotal = action.payload;
        },
        setMemberTotal(state, action: PayloadAction<number>) {
            state.memberTotal = action.payload;
        },
        getMembers(state, action: PayloadAction<any>) {},
        getAdmins(state, action: PayloadAction<any>) {},
        setIsGettingAdmins(state, action: PayloadAction<boolean>) {
            state.isGettingAdmins = action.payload;
        },
        setIsGettingMembers(state, action: PayloadAction<boolean>) {
            state.isGettingMembers = action.payload;
        },
        setGroup(state, action: PayloadAction<Partial<Group>>) {
            state.group = action.payload;
        },
        getGroup(state, action: PayloadAction<string>) {},
        setIsGetGroupFailed(state, action: PayloadAction<boolean>) {
            state.isGetGroupDetailFailed = action.payload;
        },
        setIsGettingGroup(state, action: PayloadAction<boolean>) {
            state.isGettingGroup = action.payload;
        },
        setAcceptedMemberResults(state, action: PayloadAction<any[]>) {
            state.acceptedMemberResults = action.payload;
        },
        searchAcceptedMembers(state, action: PayloadAction<any>) {},
        setMemberPageSize(state, action: PayloadAction<number>) {
            state.memberPageSize = action.payload;
        },
        setAdminPageSize(state, action: PayloadAction<number>) {
            state.adminPageSize = action.payload;
        },
        clearGroupData(state) {
            state.group = {};
            state.members = [];
            state.admins = [];
        }
    },
});

export const { actions: groupDetailActions, reducer } = slice;

export const useGroupDetailSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: groupDetailSaga });
    return { actions: slice.actions };
};
