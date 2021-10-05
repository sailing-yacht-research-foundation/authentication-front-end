import { SYRF_SERVER } from "services/service-constants";
import syrfService from 'utils/syrf-request';

export const getVesselParticipantGroups = () => {
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups`, {
  }).then(response => {
    return {
      success: true,
      data: response.data
    }
  }).catch(error => {
    return {
      success: false,
      error: error
    }
  });
}

export const getVesselParticipantGroupsByEventId = (calendarEventId, page) => {
  const userId: any = localStorage.getItem('user_id');
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups?calendarEventId_eq=${calendarEventId}&${!!userId ? `&createdById_eq=${userId}` : ''}`, {
    page: page
  }).then(response => {
    return {
      success: true,
      data: response.data
    }
  }).catch(error => {
    return {
      success: false,
      error: error
    }
  });
}

export const getAllVesselParticipantGroups = (page) => {
  const userId: any = localStorage.getItem('user_id');
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups${!!userId ? `?createdById_eq=${userId}` : ''}`, {
    params: {
      page: page
    }
  }).then(response => {
    return {
      success: true,
      data: response.data
    }
  }).catch(error => {
    return {
      success: false,
      error: error
    }
  });
}


export const getVesselParticipantGroupById = (id) => {
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups/${id}`, {
  }).then(response => {
    return {
      success: true,
      data: response.data
    }
  }).catch(error => {
    return {
      success: false,
      error: error
    }
  });
};

export const create = (data) => {
  return syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups`, data)
    .then(response => {
      return {
        success: true,
        data: response.data
      }
    }).catch(error => {
      return {
        success: false,
        error: error
      }
    });
}

export const update = (vesselParticipantGroupId, data) => {
  return syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups/${vesselParticipantGroupId}`, {
      ...data
  }).then(response => {
      return {
          success: true,
          data: response.data
      }
  }).catch(error => {
      return {
          success: false,
          error: error
      }
  });
}

export const deleteVesselParticipantGroup = (vesselParticipantGroupId) => {
  return syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups/${vesselParticipantGroupId}`)
      .then(response => {
          return {
              success: true,
              data: response.data
          }
      }).catch(error => {
          return {
              success: false,
              error: error
          }
      })
}

export const getVesselParticipantGroupsByEventIdWithSort = (calendarEventId, page) => {
  const userId: any = localStorage.getItem('user_id');
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participant-groups?calendarEventId_eq=${calendarEventId}&sort=createdAt&srdir=1&${!!userId ? `&createdById_eq=${userId}` : ''}`, {
    page: page
  }).then(response => {
    return {
      success: true,
      data: response.data
    }
  }).catch(error => {
    return {
      success: false,
      error: error
    }
  });
}