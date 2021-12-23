import { SYRF_SERVER } from "services/service-constants";
import { formatRequestPromiseResponse } from "utils/helpers";
import syrfService from 'utils/syrf-request';

export const subscribe = (competitionUnitId) => {
    return formatRequestPromiseResponse(syrfService.post(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/subscribe`, {
        competitionUnitId: competitionUnitId
    }));
}

export const unsubscribe = (competitionUnitId, sessionToken = '') => {
    const headers = {};
    if (sessionToken) headers['Authorization'] = "Bearer " + sessionToken;
    return formatRequestPromiseResponse(syrfService.post(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/unsubscribe`, {
        competitionUnitId: competitionUnitId
    }, {
        headers: {
            ...headers
        }
    }))
}

export const checkForUserSubscribeStatus = (competitionUnitId) => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition?competitionUnitId_eq=${competitionUnitId}`))
}

export const getUDPServerDetail = () => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/udp-server`))
}

export const getExpeditionByCompetitionUnitId = (competitionUnit) => {
    return formatRequestPromiseResponse(syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/competition-unit/${competitionUnit}`))
}