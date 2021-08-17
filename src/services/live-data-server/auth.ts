import axios from "axios";
import { SYRF_SERVER } from "services/service-constants";
import { v4 as uuidv4 } from 'uuid';

let uuid = localStorage.getItem('uuid');

if (uuid === null) {
    uuid = uuidv4();
    if (uuid)
        localStorage.setItem('uuid', uuid);
}

export const login = () => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/login`, {
        id: uuid,
        devToken: SYRF_SERVER.DEV_TOKEN
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

export const anonymousLogin = () => {
    return axios.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/auth/anonymous-login`, {
        id: uuid,
        devToken: SYRF_SERVER.DEV_TOKEN
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

export const validateToken = (token) => {

}