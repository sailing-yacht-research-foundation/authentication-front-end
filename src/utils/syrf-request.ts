import axios from 'axios';
import { anonymousLogin, renewToken } from 'services/live-data-server/auth';
import { store } from 'store/configureStore';
import { loginActions } from 'app/pages/LoginPage/slice';
import { message } from 'antd';
import i18next from 'i18next';
import { translations } from 'locales/translations';
import { subscribeUser } from 'subscription';
import { unregisterPushSubscription } from './helpers';
import moment from 'moment';

let isRefreshing = false;

/**
 * Class Request
 * For interacting with SYRF relative APIs
 */
class Request {
    failedRequests: any[];
    client;

    constructor() {
        this.failedRequests = [];
        this.client = axios.create();
        this.beforeRequest = this.beforeRequest.bind(this);
        this.onRequestFailure = this.onRequestFailure.bind(this);
        this.processQueue = this.processQueue.bind(this);
        this.client.interceptors.request.use(this.beforeRequest);
        this.client.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
    }

    performClearDataForAuthUser() {
        unregisterPushSubscription();
        subscribeUser();
        store.dispatch(loginActions.setLogout());
    }

    async beforeRequest(request) {

        if (isRefreshing) {
            return request;
        }

        isRefreshing = true;
        const tokenExpiredDate = localStorage.getItem('token_expired_date');
        const refreshTokenExpiredDate = localStorage.getItem('refresh_token_expired_date');
        const tokenExpiredDateAsMoment = moment(tokenExpiredDate);
        const refreshTokenExpiredDateAsMoment = moment(refreshTokenExpiredDate);
        const refreshToken = localStorage.getItem('refresh_token');
        let token = localStorage.getItem('session_token');

        if (!refreshToken || !refreshTokenExpiredDate || moment().isAfter(refreshTokenExpiredDateAsMoment)) { // the refresh token is expired, gotta refresh it by login again.
            this.performClearDataForAuthUser();
            let responseData: any = await anonymousLogin();
            if (responseData.data) {
                localStorage.setItem('is_guest', '1');
                this.setLocalStorageData(responseData.data.token, responseData.data.refresh_token, responseData.data.expiredAt, responseData.data.refreshExpiredAt);
                token = responseData.data.token;
            }
        }

        if (refreshToken && moment().isAfter(tokenExpiredDateAsMoment)
            && moment().isBefore(refreshTokenExpiredDateAsMoment)) {
            const response = await renewToken(refreshToken);

            if (response.data) {
                this.setLocalStorageData(response.data.newtoken, response.data.refresh_token, response.data.expiredAt, response.data.refreshExpiredAt);
                token = response.data.newtoken;
            } else { // in case the renew failed, we clear the data and push the user to login again.
                this.performClearDataForAuthUser();
                message.info(i18next.t(translations.general.your_session_is_expired));
            }
        }

        if (token)
            request.headers['Authorization'] = "Bearer " + token;

        isRefreshing = false;

        return request;
    }

    setLocalStorageData(token, refreshToken, tokenExpireDate, refreshExpireDate) {
        localStorage.setItem('session_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('token_expired_date', tokenExpireDate);
        localStorage.setItem('refresh_token_expired_date', refreshExpireDate);
    }

    async onRequestSuccess(response) {
        return response;
    }

    async onRequestFailure(err) {
        const errorResponseData = err.response?.data;
        if (errorResponseData?.errorCode === 'E001' && errorResponseData.message === 'token expired') {
            this.performClearDataForAuthUser();
            message.info(i18next.t(translations.general.your_session_is_expired));
        }
        throw err;
    }

    processQueue(error, token = null) {
        this.failedRequests.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedRequests = [];
    }

}

const request = new Request();

export default request.client;
