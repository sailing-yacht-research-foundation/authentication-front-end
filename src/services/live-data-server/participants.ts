import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAllByCalendarEventId = (calendarEventId: string, page: number, size: number = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants`, {
        params: {
            page: page,
            size
        }
    }))
}

export const getAcceptedAndSelfRegisteredParticipantByCalendarEventId = (calendarEventId: string, page: number, size: number = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants?statuses=ACCEPTED,SELF_REGISTERED`, {
        params: {
            page: page,
            size
        }
    }))
}

export const getAllByCalendarEventIdWithFilter = (calendarEventId: string, page: number, size: number, assignMode: string) => {
    let assign: any = null;
    if (assignMode === 'all') {
        assign = null;
    } else {
        assign = assignMode === 'assigned';
    }
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/participants${assign !== null ? `?assigned=${assign}` : ''}`, {
        params: {
            page: page,
            size
        }
    }))
}

export const get = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`))
}

export const create = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants`, {
        ...data
    }))
}

export const update = (id: string, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`, data))
}

export const deleteParticipant = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${id}`))
}

export const getAllByVesselParticipantId = (vesselParticipantId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants`))
}

export const registerParticipantsToVesselParticipant = (vesselParticipantId: string, participants: any[]) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants`, {
        participantIds: participants
    }))
}

export const unregisterParticipantFromVesselParticipant = (vesselParticipantId: string, participantId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}/participants/${participantId}`))
}

export const getMyInvitedEvents = (page: number, size: number = 10) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/my-invitation`, {
        params: {
            page,
            size
        }
    }))
}

export const acceptInvitation = (requestId: string, vesselId: string, vesselParticipantGroupId: string, sailNumber: string, allowShareInformation: boolean) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${requestId}/accept-invitation`, {
        vesselId,
        vesselParticipantGroupId,
        sailNumber,
        allowShareInformation
    }))
}

export const rejectInvitation = (requestId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${requestId}/reject-invitation`));
}

export const blockParticipant = (participantId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${participantId}/block`));
}

export const inviteCompetitor = (competitors) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants`, competitors));
}

export const inviteGroupsAsCompetitors = (groups, calendarEventId) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/invite-from-groups`, {
        groupId: groups,
        calendarEventId,
    }));
}

export const shareInformationAfterJoinedEvent = (participantId: string, allowShareInformation: boolean) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/participants/${participantId}`, {
        allowShareInformation
    }));
}
