import axios from 'axios';
import { anonymousLogin, renewToken } from 'services/live-data-server/auth';
import { store } from 'store/configureStore';
import { loginActions } from 'app/pages/LoginPage/slice';
import { message } from 'antd';
import i18next from 'i18next';
import { translations } from 'locales/translations';
import { subscribeUser } from 'subscription';

let isCallingRefresh = false;

/**
 * Class Request
 * For interacting with SYRF relative APIs
 */
class Request {
    isRefreshing: boolean;
    failedRequests: any[];
    client;

    constructor() {
        this.isRefreshing = false;
        this.failedRequests = [];
        this.client = axios.create();
        this.beforeRequest = this.beforeRequest.bind(this);
        this.onRequestFailure = this.onRequestFailure.bind(this);
        this.processQueue = this.processQueue.bind(this);
        this.client.interceptors.request.use(this.beforeRequest);
        this.client.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
    }

    async beforeRequest(request) {
        let token = localStorage.getItem('session_token');
        if (token)
            request.headers['Authorization'] = "Bearer " + token;
        return request;
    }

    async onRequestSuccess(response) {
        let retried = localStorage.getItem('tried_getting_token');
        if (retried) localStorage.removeItem('tried_getting_token');

        return response;
    }

    async onRequestFailure(err) {
        if (err.response) {
            if (err.response?.status === 401) {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken && !isCallingRefresh) {
                    isCallingRefresh = true;
                    let response = await renewToken(refreshToken);
                    isCallingRefresh = false;
                    if (response.success) {
                        localStorage.setItem('session_token', response?.data?.newtoken);
                        localStorage.setItem('refresh_token', response?.data?.refresh_token);
                        if (!localStorage.getItem('is_guest')) { // this user is a real user, we subscribe the notification.
                            subscribeUser();
                        }
                    } else {
                        store.dispatch(loginActions.setLogout());
                        message.info(i18next.t(translations.app.your_session_is_expired));
                    }
                }
            } else if (err.response?.status === 400
                && err.response?.data?.errorCode === 'E003') {
                let retried = localStorage.getItem('tried_getting_token');
                if (!retried) {
                    let responseData: any = await anonymousLogin();
                    if (responseData.data) {
                        localStorage.setItem('session_token', responseData.data?.token);
                        localStorage.setItem('refresh_token', responseData.data?.refresh_token);
                        localStorage.setItem('is_guest', '1');
                    }
                    localStorage.setItem('tried_getting_token', '1');
                    window.location.reload();
                } else {
                    message.info(i18next.t(translations.app.our_service_is_temporary_unavailable_at_the_moment));
                }
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

}

const request = new Request();

export default request.client;
