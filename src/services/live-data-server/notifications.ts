import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getUserNotifications = (page: number, size: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/notifications`, {
        params: {
            page: page,
            size: size
        }
    }))
}

export const markNotificationsAsRead = (ids: string[]) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/notifications/mark-as-read`, {
        ids: ids
    }))
}

export const getNotificationsUnreadCount = () => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/notifications/unread`))
}

export const markAllNotificationAsRead = () => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/notifications/mark-all-as-read`))
}