import { SYRF_SERVER } from "services/service-constants";
import { formatServicePromiseResponse } from "utils/helpers";
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

export const updateProfileSettings = (data) => {
    return syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users`, data)
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
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users`))
}

export const changePassword = (password) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/reset-password/`, {
        value: password,
        temporary: false,
        type: 'password'
    }))
}

export const uploadAvatar = (formData) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/avatar-upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }))
}

export const updateAgreements = (data) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/accept-eula`, data))
}

export const sendPhoneVerification = () => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/send-phone-verification`));
}

export const verifyPhoneNumber = (code) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/verify-phone-code`, {
        code
    }));
}

export const updateInterests = (interests) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/interests`, interests));
}

export const updateShareableInformation = (form) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/shareable-info`, form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }));
}

export const getShareableInformation = () => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/shareable-info`));
}

export const removeCovidCard = () => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/covid-vaccination-card`));
}

export const removePassportPhoto = () => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/passport-photo`))
}