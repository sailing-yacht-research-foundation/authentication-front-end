import syrfRequest from 'utils/syrf-request';
import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';

export const getMyGroups = (page: number, size: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-groups`, {
        params: {
            page: page,
            size: size
        }
    }))
}

export const searchMyGroups = (keyword: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-groups`, {
        params: {
            q: keyword
        }
    }))
}

export const searchGroupForAssigns = (keyword: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-assignable-groups`, {
        params: {
            q: keyword
        }
    }));
}

export const searchGroups = (searchKeyword: string, page: number, size: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups?q=${searchKeyword}`, {
        params: {
            page: page,
            size
        }
    }))
}

export const createGroup = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups`, data))
}

export const updateGroup = (id: string, data) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${id}`, data))
}

export const getGroupById = (id: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${id}/detail`))
}

export const getGroupInvitations = (page: number, size: number,status: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/my-groups?status=${status}`, {
        params: {
            page: page,
            size
        }
    }))
}

export const requestJoinGroup = (groupId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/join`))
}

export const getAdmins = (groupId: string, page: number, size: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/members?isAdmin_eq=true`, {
        params: {
            page: page,
            size
        }
    }))
}

export const getMembers = (groupId: string, page: number, size: number, status: string = '') => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/members?isAdmin_eq=false${status ? `&status_eq=${status}` : ''}`, {
        params: {
            page: page,
            size
        }
    }))
}

export const getUserJoinRequests = (groupId: string, page: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/join-requests`, {
        params: {
            page: page
        }
    }))
}

export const removeMemberFromTheGroup = (groupId: string, invitationId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/kick`, {
        data: {
            id: invitationId
        }
    }))
}

export const removeAsAdmin = (groupId: string, invitationId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/remove-admin`, {
        data: {
            id: invitationId
        }
    }))
}

export const inviteUsersViaEmails = (groupId: string, emails: string[]) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/invite`, {
        groupId: groupId,
        emails: emails
    }))
}

export const assignAdmin = (groupId: string, memberId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/add-admin`, {
        id: memberId
    }))
}

export const searchMembers = (groupId: string, keyword: string, status: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/members?isAdmin_eq=false${status && `&status_eq=` + status}`, {
        params: {
            q: keyword
        }
    }))
}

export const leaveGroup = (groupId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/leave`))
}

export const deleteGroup = (groupId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/delete-group`, {
        data: {
            groupId: groupId
        }
    }))
}

export const userAcceptInvitationRequest = (requestId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/accept-invitation`, {
        id: requestId
    }))
}

export const adminAcceptJoinRequest = (requestId: string, status: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/accept-request`, {
        id: requestId,
        status: status
    }))
}

export const userRejectInvitationRequest = (requestId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/reject-invitation`, {
        id: requestId
    }))
}

export const assignEventAsGroupAdmin = (groupId: string, eventId: string, isIndividualAssignment: boolean) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/set-as-event-admin`, {
        calendarEventId: eventId,
        isIndividualAssignment
    }))
}

export const uploadAvatar = (groupId: string, formData: FormData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/avatar-upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }))
}

export const revokeGroupAsEditor = (groupId: string, eventId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/revoke-admin-event`, {
        data: {
            calendarEventId: eventId
        }
    }));
}

export const getValidOrganizableGroup = () => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/valid-organizer`));
}

export const blockMember = (groupId: string, memberId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/block`, {
        userId: memberId
    }));
}

export const unBlockMember = (groupId: string, memberId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/groups/${groupId}/unblock`, {
        userId: memberId
    }));
}