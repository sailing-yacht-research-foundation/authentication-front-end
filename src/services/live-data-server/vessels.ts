import { SYRF_SERVER } from 'services/service-constants';
import { formatRequestPromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getMany = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels${!!userId ? `?createdById_eq=${userId}` : ''}&bulkCreated_eq=false`, {
        params: {
            page: page
        }
    }))
}

export const get = (id) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`))
}

export const create = (data) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels`, {
        ...data
    }))
}

export const update = (id, data) => {
    return formatRequestPromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`, {
        ...data
    }))
}

export const deleteVessel = (id) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${id}`))
}

export const getManyVesselsByEventCalendarId = (calendarEventId, page) => {
    const userId: any = localStorage.getItem('user_id');
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/vessels`, {
        params: {
            page: page
        }
    }))
}