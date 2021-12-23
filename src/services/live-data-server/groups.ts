import syrfRequest from 'utils/syrf-request';
import { SYRF_SERVER } from 'services/service-constants';
import { formatRequestPromiseResponse } from 'utils/helpers';

export const getMyGroups = (page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-groups`, {
        params: {
            page: page
        }
    }))
}

export const searchMyGroups = (keyword) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-groups`, {
        params: {
            q: keyword
        }
    }))
}

export const searchGroupForAssigns = (keyword) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-assignable-groups`, {
        params: {
            q: keyword
        }
    }));
}

export const searchGroups = (searchKeyword, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups?q=${searchKeyword}`, {
        params: {
            page: page
        }
    }))
}

export const createGroup = (data) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups`, data))
}

export const updateGroup = (id, data) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${id}`, data))
}

export const getGroupById = (id) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${id}/detail`))
}

export const getGroupInvitations = (page, status) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-groups?status=${status}`, {
        params: {
            page: page
        }
    }))
}

export const requestJoinGroup = (groupId) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/join`))
}

export const getAdmins = (groupId, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/members?isAdmin_eq=true`, {
        params: {
            page: page
        }
    }))
}

export const getMembers = (groupId, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/members?isAdmin_eq=false`, {
        params: {
            page: page
        }
    }))
}

export const getUserJoinRequests = (groupId, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/join-requests`, {
        params: {
            page: page
        }
    }))
}

export const removeMemberFromTheGroup = (groupId, invitationId) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/kick`, {
        data: {
            id: invitationId
        }
    }))
}

export const removeAsAdmin = (groupId, invitationId) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/remove-admin`, {
        data: {
            id: invitationId
        }
    }))
}

export const inviteUsersViaEmails = (groupId, emails: any[]) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/invite`, {
        groupId: groupId,
        emails: emails
    }))
}

export const assignAdmin = (groupId, memberId) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/add-admin`, {
        id: memberId
    }))
}

export const searchMembers = (groupId, keyword, status) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/members?isAdmin_eq=false${status && `&status_eq=` + status}`, {
        params: {
            q: keyword
        }
    }))
}

export const leaveGroup = (groupId) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/leave`))
}

export const deleteGroup = (groupId) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/delete-group`, {
        data: {
            groupId: groupId
        }
    }))
}

export const userAcceptInvitationRequest = (requestId) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/accept-invitation`, {
        id: requestId
    }))
}

export const adminAcceptJoinRequest = (requestId, status) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/accept-request`, {
        id: requestId,
        status: status
    }))
}

export const userRejectInvitationRequest = (requestId) => {
    return formatRequestPromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/reject-invitation`, {
        id: requestId
    }))
}

export const assignEventAsGroupAdmin = (groupId: string, eventId: string, isIndividualAssignment: boolean) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/set-as-event-admin`, {
        calendarEventId: eventId,
        isIndividualAssignment
    }))
}

export const uploadAvatar = (groupId, formData) => {
    return formatRequestPromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/avatar-upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }))
}

export const revokeGroupAsEditor = (groupId, eventId) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/revoke-admin-event`, {
        data: {
            calendarEventId: eventId
        }
    }));
}