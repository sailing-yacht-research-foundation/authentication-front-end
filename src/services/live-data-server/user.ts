import { SYRF_SERVER } from "services/service-constants";
import syrfRequest from "utils/syrf-request";


export const getUser = () => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/user`)
    .then(response => {
        return {
            success: true,
            user: response.data.user
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    })
} 

export const updateProfile = (userId, data) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/${userId}/update-profile`, data)
    .then(response => {
        return {
            success: true,
            user: response.data.user
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    })
}

export const deleteUser = (userId, data) => {
    return syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/${userId}/delete/`)
    .then(response => {
        return {
            success: true
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    })
}

export const changePassword = (userId, data) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/${userId}/change-password/`, data)
    .then(response => {
        return {
            success: true
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    });
}