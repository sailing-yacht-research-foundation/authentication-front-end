import syrfRequest from 'utils/syrf-request';
import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';

export const getAllByVesselId = (vesselId) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/${vesselId}/life-rafts`));
}

export const create = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/life-rafts`, data));
}

export const update = (liferaftId, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/life-rafts/${liferaftId}`, data));
}

export const getLifeRaft = (liferaftId) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/life-rafts/${liferaftId}`));
}

export const deleteLiferaft = (liferaftId) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessels/life-rafts/${liferaftId}`));

}