import axios from "axios";
import { SYRF_SERVER } from "services/service-constants";
import { v4 as uuidv4 } from 'uuid';

let uuid = localStorage.getItem('uuid');

if (uuid === null) {
    uuid = uuidv4();
    if (uuid)
        localStorage.setItem('uuid', uuid);
}

export const login = ({ email, password }) => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/login`, {
        email: email,
        password: password,
    }).then(response => {
        return {
            success: true,
            token: response.data.token,
            user: response.data.user
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
            token: response.data?.token
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}

export const validateToken = (token) => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/validate-token`, {
        token: token,
        renew: false
    }).then(response => {
        return {
            success: true,
            token: response.data.token
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}

export const register = (data) => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/register`, data)
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

export const verifyEmail = (data) => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/vefify-email`, {
        code: data.code,
        email: data.email
    })
    .then(response => {
        return {
            success: true,
        }
    }).catch(error => {
        return {
            sucess: false,
            error: error
        }
    })
}