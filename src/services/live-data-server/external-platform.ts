import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getCredentialByPage = ({ page, size }, source = '') => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/external-platform/credential-list${source && `?source=${source}`}`, {
        params: {
            page,
            size
        }
    }))
}

export const submitNewCredential = ({ user, password }, source = 'YACHTSCORING') => {
    return formatServicePromiseResponse(
        syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/external-platform/submit-credentials`, {
            user: user,
            password,
            source
        })
    )
}

export const removeCredential = (credentialId) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/external-platform/delete-credentials/${credentialId}`, {
        data: {
            credentialId
        }
    }));
}

export const getEventsUsingCredentialId = (credentialId) => {
    return formatServicePromiseResponse(
        syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/external-platform/get-events/${credentialId}`)
    );
}

export const importEventFromExternalEvent = (credentialId, externalEventId, calendarEventId) => {
    return formatServicePromiseResponse(
        syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/external-platform/import-to-calendar`, {
            credentialId,
            externalEventId,
            calendarEventId,
        })
    );
}