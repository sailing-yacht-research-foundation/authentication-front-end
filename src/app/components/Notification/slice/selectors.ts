import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../../../types';
import { initialState } from '.';

export const selectUnreadNotificationsCount = createSelector(
  [(state: RootState) => state.notification || initialState],
  notificationState => notificationState.unreadCount,
);

export const selectMarkAllAsReadSuccess = createSelector(
  [(state: RootState) => state.notification || initialState],
  notificationState => notificationState.markAllAsReadSuccess,
);
