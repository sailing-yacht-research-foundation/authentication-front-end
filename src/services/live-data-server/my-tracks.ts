import { SYRF_SERVER } from 'services/service-constants';
import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { Track } from 'types/Track';
import { parseFilterSorterParams, showToastMessageOnRequestError } from 'utils/helpers';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAllTracks = (page: number, size: number = 10, filter: TableFiltering[] = [], sorter: Partial<TableSorting> | null = null) => {
    const sortAndFilterString = parseFilterSorterParams(filter, sorter);
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/${!!userId ? `?createdById_eq=${userId}` : ''}${sortAndFilterString ?? sortAndFilterString}`, {
        params: {
            page: page,
            size: size
        }
    }))
}

export const downloadTrack = (track: Track, type: string) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/${track.id}/export-track/${type}${track.trackJson?.id ? `?trackJsonId=${track.trackJson?.id}` : ''}`, { responseType: 'blob' })
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

export const claimTrack = (competitionUnitId: string, vesselParticipantId: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/claim-track`, {
        competitionUnitId,
        vesselParticipantId
    }));
}