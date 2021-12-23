import { SYRF_SERVER } from 'services/service-constants';
import { formatRequestPromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAllByCalendarEventId = (calendarEventId, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants`, {
        params: {
            page: page
        }
    }))
}

export const getAllByCalendarEventIdWithFilter = (calendarEventId, page, assignMode) => {
    let assign: any = null;
    if (assignMode === 'all') {
        assign = null;
    } else {
        assign = assignMode === 'assigned';
    }
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants${assign !== null ? `?assigned=${assign}` : ''}`, {
        params: {
            page: page
        }
    }))
}

export const get = (id) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`))
}

export const create = (data) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants`, {
        ...data
    }))
}

export const update = (id, data) => {
    return formatRequestPromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`, {
        ...data
    }))
}

export const deleteParticipant = (id) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`))
}

export const getAllByVesselParticipantId = (vesselParticipantId) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants`))
}

export const registerParticipantsToVesselParticipant = (vesselParticipantId, participants: any[]) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants`, {
        participantIds: participants
    }))
}

export const unregisterParticipantFromVesselParticipant = (vesselParticipantId, participantId) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants/${participantId}`))
}