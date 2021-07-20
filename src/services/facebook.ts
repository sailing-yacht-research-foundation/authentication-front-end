import axios from 'axios';
import { getUserAttribute } from 'utils/user-utils';
import { SERVICE_URL } from './serviceConstants';

export function getFeeds(user) {
    return axios.get('https://graph.facebook.com/me/feed?fields=attachments', {
        params: {
            access_token: getUserAttribute(user, 'custom:fb_token')
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}

export function exchangeToken(payload) {
    return axios.post(`${SERVICE_URL}/facebook/token/exchange`, {
        token: payload.payload
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}