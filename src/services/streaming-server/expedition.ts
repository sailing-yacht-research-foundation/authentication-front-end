import { SYRF_SERVER } from "services/service-constants";
import { formatServicePromiseResponse } from "utils/helpers";
import syrfService from 'utils/syrf-request';

export const subscribe = (competitionUnitId) => {
    return formatServicePromiseResponse(syrfService.post(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/subscribe`, {
        competitionUnitId: competitionUnitId
    }));
}

export const unsubscribe = (competitionUnitId, sessionToken = '') => {
    const headers = {};
    if (sessionToken) headers['Authorization'] = "Bearer " + sessionToken;
    return formatServicePromiseResponse(syrfService.post(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/unsubscribe`, {
        competitionUnitId: competitionUnitId
    }, {
        headers: {
            ...headers
        }
    }))
}

export const checkForUserSubscribeStatus = (competitionUnitId) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition?competitionUnitId_eq=${competitionUnitId}`))
}

export const getUDPServerDetail = () => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/udp-server`))
}

export const getExpeditionByCompetitionUnitId = (competitionUnit) => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/competition-unit/${competitionUnit}`))
}