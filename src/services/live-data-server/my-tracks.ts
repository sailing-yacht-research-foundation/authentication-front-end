import { SYRF_SERVER } from 'services/service-constants';
import syrfRequest from 'utils/syrf-request';

export const getAllTracks = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    })
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

export const downloadTrack = (track, type) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/7cb23d92-5d32-4aad-9bc0-8af3ef6b6317/export-track/${type}`, { responseType: 'blob' })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${track.event?.name}.${type}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            return {
                success: false,
                error: error
            }
        })
}