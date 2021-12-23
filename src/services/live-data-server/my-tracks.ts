import i18next from 'i18next';
import { translations } from 'locales/translations';
import { toast } from 'react-toastify';
import { SYRF_SERVER } from 'services/service-constants';
import { formatRequestPromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAllTracks = (page, size = 10) => {
    const userId: any = localStorage.getItem('user_id');
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/my-tracks/${!!userId ? `?createdById_eq=${userId}` : ''}`, {
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

            if (error?.response?.status === 404) {
                toast.error(i18next.t(translations.misc.your_file_is_not_found));
            } else {
                toast.error(i18next.t(translations.misc.an_error_happended_when_downloading_your_track));
            }
            return {
                success: false,
                error: error
            }
        })
}