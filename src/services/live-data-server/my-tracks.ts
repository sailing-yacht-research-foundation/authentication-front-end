import { SYRF_SERVER } from 'services/service-constants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAllTracks = (page, size = 10) => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page,
            size: size
        }
    }))
}

export const downloadTrack = (track, type) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/${track.id}/export-track/${type}`, { responseType: 'blob' })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${track.event?.name}.${type}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            showToastMessageOnRequestError(error);
            return {
                success: false,
                error: error
            }
        })
}

export const importGPXTrack = (formData) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/import-gpx`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }));
}

export const importExpeditionTrack = (formData) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/import-expedition-log`, formData, {
        headers: { "content-type": "multipart/form-data" }
    }));
}

