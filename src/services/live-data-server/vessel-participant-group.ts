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