/**
 * Root saga manages watcher lifecycle
 */

 import { notificationActions } from ".";
 import { call, put, takeLatest } from 'redux-saga/effects';
 import { getNotificationsUnreadCount, markAllNotificationAsRead } from "../../../../services/live-data-server/notifications";
 import { showToastMessageOnRequestError } from "../../../../utils/helpers";
 
 export function* markAllAsRead(action) {
     const response = yield call(markAllNotificationAsRead);

     if (!response.success) {
         showToastMessageOnRequestError(response.error);
     } else {
         yield put(notificationActions.getNotificationUnreadCount());
     }
 }
  
 export function* getUnreadCount(action) {
    const response = yield call(getNotificationsUnreadCount);

    if (response.success) {
        yield put(notificationActions.setNumberOfUnreadNotification(response.data.unreadCount));
    }
} 

 export default function* notificationSaga() {
     yield takeLatest(notificationActions.markAllAsRead.type, markAllAsRead);
     yield takeLatest(notificationActions.getNotificationUnreadCount.type, getUnreadCount);
 }
 