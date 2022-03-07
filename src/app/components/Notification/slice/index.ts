import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '../../../../utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from '../../../../utils/redux-injectors';
import { NotificationState } from './types';
import notificationSaga from './saga';

export const initialState: NotificationState = {
    unreadCount: 0,
};

const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNumberOfUnreadNotification(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        markAllAsRead(state) {},
        getNotificationUnreadCount(state) {}
    },
});

export const { actions: notificationActions, reducer } = slice;

export const useNotificationSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: notificationSaga });
    return { actions: slice.actions };
};
