import axios from 'axios';
import { anonymousLogin, logout, renewToken } from 'services/live-data-server/auth';
import { store } from 'store/configureStore';
import { loginActions } from 'app/pages/LoginPage/slice';
import { myEventListActions } from 'app/pages/MyEventPage/slice';
import { message } from 'antd';
import i18next from 'i18next';
import { translations } from 'locales/translations';
import { subscribeUser } from 'subscription';
import { retryWrapper, unregisterPushSubscription } from './helpers';
import moment from 'moment';
import { AuthCode } from './constants';


/**
 * Class Request
 * For interacting with SYRF relative APIs
 */
class Request {
    failedRequests: any[];
    client;
    static promiseRefresh;

    constructor() {
        this.failedRequests = [];
        this.client = axios.create();
        this.beforeRequest = this.beforeRequest.bind(this);
        this.onRequestFailure = this.onRequestFailure.bind(this);
        this.processQueue = this.processQueue.bind(this);
        this.client.interceptors.request.use(this.beforeRequest);
        this.client.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
    }

    performClearDataForAuthUser(refreshToken) {
        if (refreshToken) {
            logout(refreshToken);
        }

        store.dispatch(loginActions.setLogout());
        store.dispatch(myEventListActions.clearEventsListData());
        unregisterPushSubscription();
    }

    async beforeRequest(request) {

        if (Request.promiseRefresh) {
            const response = await Request.promiseRefresh;
            const newToken = response?.data?.token || response?.data?.newtoken;
            if (newToken) {
                request.headers['Authorization'] = "Bearer " + newToken;
            }
            return request;
        }

        const tokenExpiredDate = localStorage.getItem('token_expired_date');
        const refreshTokenExpiredDate = localStorage.getItem('refresh_token_expired_date');
        const tokenExpiredDateAsMoment = moment(tokenExpiredDate).subtract(5, 'hours');
        const refreshTokenExpiredDateAsMoment = moment(refreshTokenExpiredDate).subtract(1, 'days');
        const refreshToken = localStorage.getItem('refresh_token');
        const isGuest = localStorage.getItem('is_guest');
        let token = localStorage.getItem('session_token');

        if (!refreshToken || !refreshTokenExpiredDate || moment().isAfter(refreshTokenExpiredDateAsMoment)) { // the refresh token is expired, gotta refresh it by login again.
            this.performClearDataForAuthUser(refreshToken);
            Request.promiseRefresh = anonymousLogin()
            const responseData: any = await Request.promiseRefresh;
            if (responseData.data) {
                localStorage.setItem('is_guest', '1');
                this.setLocalStorageData(responseData.data.token, responseData.data.refresh_token, responseData.data.expiredAt, responseData.data.refreshExpiredAt);
                token = responseData.data.token;
            }
        }

        if (refreshToken && moment().isAfter(tokenExpiredDateAsMoment)
            && moment().isBefore(refreshTokenExpiredDateAsMoment)) {
            Request.promiseRefresh = renewToken(refreshToken);
            const response = await Request.promiseRefresh;

            if (response.data) {
                token = response.data.newtoken;
                this.storeTokensAndResubscribeUser(isGuest, response);
            } else { // in case the renew failed, we clear the data and push the user to login again.
                this.eraseUserDataAndShowTokenExpired(refreshToken);
            }
        }

        Request.promiseRefresh = null;

        if (token) {
            request.headers['Authorization'] = "Bearer " + token;
        }

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
        if (Request.promiseRefresh) {
            throw err;
        }

        const errorResponseData = err.response?.data;
        const isGuest = localStorage.getItem('is_guest');
        if ([AuthCode.EXPIRED_SESSION_TOKEN, AuthCode.INVALID_SESSION_TOKEN].includes(errorResponseData?.errorCode)
            && err.response?.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                Request.promiseRefresh = renewToken(refreshToken);
                const response = await Request.promiseRefresh; // try to renew the token if possible
                if (response.success) {
                    this.storeTokensAndResubscribeUser(isGuest, response);
                } else {
                    if (!isGuest) { // is an authorized user but cannot renew token somehow, and become a guest.
                        this.eraseUserDataAndShowTokenExpired(refreshToken);
                    }
                    // perform anonymous login
                    Request.promiseRefresh = anonymousLogin();
                    const responseData: any = await Request.promiseRefresh;
                    if (responseData.data) {
                        this.setLocalStorageData(responseData.data.token, responseData.data.refresh_token, responseData.data.expiredAt, responseData.data.refreshExpiredAt);
                    }
                }
                Request.promiseRefresh = null;
            }
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

    storeTokensAndResubscribeUser(isGuest, response) {
        this.setLocalStorageData(response.data.newtoken, response.data.refresh_token, response.data.expiredAt, response.data.refreshExpiredAt);
        if (!isGuest) { // this user is a real user, we re-subscribe the notification.
            unregisterPushSubscription();
            subscribeUser();
        }
    }

    eraseUserDataAndShowTokenExpired(refreshToken) {
        this.performClearDataForAuthUser(refreshToken);
        message.info(i18next.t(translations.general.your_session_is_expired));
        localStorage.setItem('is_guest', '1');
    }
}

const request = new Request();

retryWrapper(request.client, { retry_time: 2 })

export default request.client;
