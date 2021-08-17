import axios from 'axios';

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
