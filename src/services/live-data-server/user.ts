import { SYRF_SERVER } from "services/service-constants";
import { formatRequestPromiseResponse } from "utils/helpers";
import syrfRequest from "utils/syrf-request";


export const getUser = () => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/profile`)
    .then(response => {
        return {
            success: true,
            user: response.data
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    })
} 

export const updateProfile = (data) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users`, data)
    .then(response => {
        return {
            success: true,
            user: response.data
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    })
}

export const deleteUserAccount = () => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users`))
}

export const changePassword = (password) => {
    return formatRequestPromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/reset-password/`, {
        value: password,
        temporary: false,
        type: 'password'
    }))
}

export const uploadAvatar = (formData) => {
    return formatRequestPromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/avatar-upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }))
}

export const updateAgreements = (data) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/accept-eula`, data))
}