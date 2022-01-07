import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAllByCalendarEventId = (calendarEventId, page, size = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants`, {
        params: {
            page: page,
            size
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
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants${assign !== null ? `?assigned=${assign}` : ''}`, {
        params: {
            page: page
        }
    }))
}

export const get = (id) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`))
}

export const create = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants`, {
        ...data
    }))
}

export const update = (id, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`, {
        ...data
    }))
}

export const deleteParticipant = (id) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`))
}

export const getAllByVesselParticipantId = (vesselParticipantId) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants`))
}

export const registerParticipantsToVesselParticipant = (vesselParticipantId, participants: any[]) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants`, {
        participantIds: participants
    }))
}

export const unregisterParticipantFromVesselParticipant = (vesselParticipantId, participantId) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants/${participantId}`))
}

export const getMyInvitedEvents = (page) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/my-invitation`, {
        page
    }))
}

export const acceptInvitation = (requestId, vesselId, vesselParticipantGroupId) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${requestId}/accept-invitation`, {
        vesselId,
        vesselParticipantGroupId
    }))
}

export const rejectInvitation = (requestId) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${requestId}/reject-invitation`));
}

export const blockParticipant = (participantId) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${participantId}/block`));
}

export const inviteCompetitor = (calendarEventId, publicName, userProfileId) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants`, [
        {
            publicName,
            userProfileId,
            calendarEventId,
        }
    ]));
}
