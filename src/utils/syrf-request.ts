import axios from 'axios';
import { renewToken } from 'services/live-data-server/auth';
import { store } from 'store/configureStore';
import { loginActions } from 'app/pages/LoginPage/slice';
import { message } from 'antd';
import i18next from 'i18next';
import { translations } from 'locales/translations';

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
        return response;
    }

    async onRequestFailure(err) {
        if (err.response && err.response?.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken && !isCallingRefresh) {
                isCallingRefresh = true;
                let response = await renewToken(refreshToken);
                isCallingRefresh = false;
                if (response.success) {
                    localStorage.setItem('session_token', response?.data?.newtoken);
                    localStorage.setItem('refresh_token', response?.data?.refresh_token);
                } else {
                    store.dispatch(loginActions.setLogout());
                    message.info(i18next.t(translations.app.your_session_is_expired));
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
