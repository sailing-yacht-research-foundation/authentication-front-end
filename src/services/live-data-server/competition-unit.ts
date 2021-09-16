import { SYRF_SERVER } from "services/service-constants";
import syrfService from 'utils/syrf-request';

export const getCompetitionUnitList = () => {
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units`, {
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


export const getCompetitionUnitById = (id) => {
  return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}`, {
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