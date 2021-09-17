import { SYRF_SERVER } from "services/service-constants";
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
    return syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users`)
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

export const changePassword = (password) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/reset-password/`, {
        value: password,
        temporary: false,
        type: 'password'
    })
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

export const uploadAvatar = (formData) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/avatar-upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        return {
            success: true,
            data: response.data
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    }); 
}