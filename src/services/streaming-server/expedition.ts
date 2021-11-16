import { SYRF_SERVER } from "services/service-constants";
import syrfService from 'utils/syrf-request';

export const subscribe = (competitionUnitId) => {
    return syrfService.post(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/subscribe`, {
        competitionUnitId: competitionUnitId
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

export const unsubscribe = (competitionUnitId) => {
    return syrfService.post(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/unsubscribe`, {
        competitionUnitId: competitionUnitId
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

export const checkForUserSubscribeStatus = (competitionUnitId) => {
    return syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition?competitionUnitId_eq=${competitionUnitId}`).then(response => {
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

export const getUDPServerDetail = () => {
    return syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/udp-server`).then(response => {
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

export const getExpeditionByCompetitionUnitId = (competitionUnit) => {
    return syrfService.get(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/competition-unit/${competitionUnit}`).then(response => {
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