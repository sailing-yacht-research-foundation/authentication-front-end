import { SYRF_SERVER } from "services/service-constants";
import syrfService from 'utils/syrf-request';

export const getMany = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
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

export const create = (data) => {
    return syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants`, data).then(response => {
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

export const deleteVesselParticipant = (vesselParticipantId) => {
    return syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/vessel-participants/${vesselParticipantId}`)
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