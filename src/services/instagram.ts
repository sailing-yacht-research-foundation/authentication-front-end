import axios from 'axios';
import { getUserAttribute } from 'utils/user-utils';
import { SERVICE_URL } from './service-constants';

export async function getFeeds(user) {
    return axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_url', {
        params: {
            access_token: getUserAttribute(user, 'custom:ig_token')
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}

export function exchangeTokenFromCode(action) {
    return axios.post(`${SERVICE_URL}/instagram/token`, {
        code: action.payload
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function exChangeLongLivedToken(action) {
    return axios.post(`${SERVICE_URL}/instagram/token/exchange`, {
        token: action.payload
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}