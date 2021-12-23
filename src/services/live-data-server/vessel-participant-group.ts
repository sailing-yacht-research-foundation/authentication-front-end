import { SYRF_SERVER } from "services/service-constants";
import { formatRequestPromiseResponse } from "utils/helpers";
import syrfService from 'utils/syrf-request';

export const getVesselParticipantGroups = () => {
  return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups`, {
  }))
}

export const getVesselParticipantGroupsByEventId = (calendarEventId, page) => {
  return (syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/groups`, {
    page: page
  }))
}

export const getAllVesselParticipantGroups = (page) => {
  const userId: any = localStorage.getItem('user_id');
  return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups${!!userId ? `?createdById_eq=${userId}` : ''}`, {
    params: {
      page: page
    }
  }))
}


export const getVesselParticipantGroupById = (id) => {
  return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups/${id}`, {
  }))
};

export const create = (data) => {
  return formatRequestPromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups`, data))
}

export const update = (vesselParticipantGroupId, data) => {
  return formatRequestPromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups/${vesselParticipantGroupId}`, {
      ...data
  }))
}

export const deleteVesselParticipantGroup = (vesselParticipantGroupId) => {
  return formatRequestPromiseResponse(syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups/${vesselParticipantGroupId}`))
}

export const getVesselParticipantGroupsByEventIdWithSort = (calendarEventId, page) => {
  const userId: any = localStorage.getItem('user_id');
  return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups?calendarEventId_eq=${calendarEventId}&sort=createdAt&srdir=1&${!!userId ? `&createdById_eq=${userId}` : ''}`, {
    params: {
      page: page,
      size: 100
    }
  }))
}