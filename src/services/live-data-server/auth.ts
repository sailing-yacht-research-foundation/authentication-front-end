import axios from "axios";
import { SYRF_SERVER } from "services/service-constants";
import { formatServicePromiseResponse } from "utils/helpers";
import syrfRequest from "utils/syrf-request";
import { v4 as uuidv4 } from 'uuid';

let uuid = localStorage.getItem('uuid');

if (uuid === null) {
    uuid = uuidv4();
    if (uuid)
        localStorage.setItem('uuid', uuid);
}

export const login = ({ email, password }: { email: string, password: string }) => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/login`, {
        username: email,
        password: password,
        devToken: SYRF_SERVER.DEV_TOKEN
    }).then(response => {
        return {
            success: true,
            token: response.data.token,
            user: response.data
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}

export const anonymousLogin = () => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/anonymous-login`, {
        id: uuid,
        devToken: SYRF_SERVER.DEV_TOKEN
    }).then(response => {
        return {
            success: true,
            token: response.data?.token,
            data: response.data
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}

export const validateToken = (token: string) => {
    return syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/validate-token`, {
        token: token,
        renew: false
    }).then(response => {
        return {
            success: true,
            token: response.data.token,
            user: response.data
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}


export const renewToken = (refreshToken: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/renew-token`, {
        refresh_token: refreshToken
    }));
}

export const register = (data) => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users`, data)
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

export const verifyEmail = () => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/send-verify-email`));
}

export const sendForgotPassword = (email) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/forget-password`, {
        email: email
    }));
}

export const logout = (refresh_token: string) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/logout`, {
        refresh_token
    }));
}

export const sendRequestVerifyEmail = (email) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/users/verify-email`, {
        email: email
    }));
}