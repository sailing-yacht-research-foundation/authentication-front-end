import { SYRF_SERVER } from "services/service-constants";
import { formatRequestPromiseResponse } from "utils/helpers";
import syrfService from 'utils/syrf-request';

export const getManyByEventId = (eventId, page) => {
    const userId: any = localStorage.getItem('user_id');
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/vessel-participants`, {
        params: {
            page: page
        }
    }))
}

export const getMany = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    }))
}

export const create = (data) => {
    return formatRequestPromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants`, data))
}

export const deleteVesselParticipant = (vesselParticipantId) => {
    return formatRequestPromiseResponse(syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}`))
}